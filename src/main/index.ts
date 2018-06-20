import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage, OpenExampleProjectMessage } from './ipc-messages'
const path = require('path')
const url = require('url')

import windowStateKeeper from 'electron-window-state'
import { SpecifyProjectPathMessage, SetDocumentStateMessage } from '../gui/ipc-messages'
import { basename, join } from 'path'
import AppMenuManager from './app-menu-manager'

let mainWindow: Electron.BrowserWindow | null = null

export interface DocumentState {
  hasUnsavedChanges: boolean
  filePath: string | null,
  isExampleProject: boolean
}

let documentState: DocumentState | null = null

let initialProjectPath: string | null = null

// macOS only
app.on('open-file', (event: Event, filePath: string) => {
  if (mainWindow === null) {
    initialProjectPath = filePath
  } else {
    // TODO: macos: create window if needed if window is null because it has been closed manually
    showDiscardChangesDialogIfNeeded(mainWindow, (didCancel: boolean) => {
      event.preventDefault()
      if (!didCancel) {
        mainWindow!.webContents.send(
          OpenProjectMessage.type,
          new OpenProjectMessage(filePath)
        )
      }
    })
  }
})

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })

  let windowIconPath: string | undefined
  if (process.resourcesPath) {
    if (process.platform == 'darwin') {
      //
    } else if (process.platform == 'win32') {
      windowIconPath = join(process.resourcesPath, 'icon.ico')
    } else {
      windowIconPath = join(process.resourcesPath, 'icon.png')
    }
  }

  let window = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: windowIconPath
  })

  mainWindowState.manage(window)
  mainWindow = window

  let appMenuManager = new AppMenuManager(
    {
      onNewProject: () => {
        showDiscardChangesDialogIfNeeded(window, (didCancel: boolean) => {
          if (!didCancel) {
            window.webContents.send(
              NewProjectMessage.type,
              new NewProjectMessage()
            )
          }
        })
      },
      onOpenProject: () => {
        showDiscardChangesDialogIfNeeded(window, (didCancel: boolean) => {
          if (!didCancel) {
            dialog.showOpenDialog(
              window,
              {
                filters: [
                  { name: 'fSpy project files', extensions: ['fspy'] }
                ],
                properties: ['openFile']
              },
              (filePaths: string[]) => {
                if (filePaths !== undefined) {
                  window.webContents.send(
                    OpenProjectMessage.type,
                    new OpenProjectMessage(filePaths[0])
                  )
                }
              }
            )
          }
        })
      },
      onSaveProject: () => {
        window.webContents.send(
          SaveProjectMessage.type,
          new SaveProjectMessage()
        )
      },
      onSaveProjectAs: () => {
        dialog.showSaveDialog(
          window,
          {},
          (filePath: string) => {
            if (filePath !== undefined) {
              window.webContents.send(
                SaveProjectAsMessage.type,
                new SaveProjectAsMessage(filePath)
              )
            }
          }
        )
      },
      onOpenImage: () => {
        dialog.showOpenDialog(
          window,
          {
            properties: ['openFile']
          },
          (filePaths: string[]) => {
            if (filePaths !== undefined) {
              window.webContents.send(
                OpenImageMessage.type,
                new OpenImageMessage(filePaths[0])
              )
            }
          }
        )
      },
      onOpenExampleProject: () => {
        showDiscardChangesDialogIfNeeded(window, (didCancel: boolean) => {
          if (!didCancel) {
            window.webContents.send(
              OpenExampleProjectMessage.type,
              new OpenExampleProjectMessage()
            )
          }
        })
      },
      onQuit: () => {
        app.quit()
      }
    }
  )

  window.on('ready-to-show', () => {
    refreshTitle(window)
    window.show()
    window.focus()

    documentState = {
      hasUnsavedChanges: false,
      filePath: null,
      isExampleProject: false
    }

    if (initialProjectPath) {
      window.webContents.send(
        OpenProjectMessage.type,
        new OpenProjectMessage(initialProjectPath)
      )
    }

    if (process.env.DEV) {
      // show dev tools
      // window.webContents.openDevTools({ mode: 'bottom' })
    }
  })

  const startUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const devUrl = 'http://localhost:8080'

  window.loadURL(process.env.DEV ? devUrl : startUrl)

  Menu.setApplicationMenu(appMenuManager.menu)

  window.on('close', (event: Event) => {
    showDiscardChangesDialogIfNeeded(window, (didCancel: boolean) => {
      if (didCancel) {
        event.preventDefault()
      } else {
        ipcMain.removeAllListeners(SetDocumentStateMessage.type)
        ipcMain.removeAllListeners(SpecifyProjectPathMessage.type)
        mainWindow = null
        documentState = null
        initialProjectPath = null
      }
    })
  })

  ipcMain.on(SpecifyProjectPathMessage.type, (_: any, __: SpecifyProjectPathMessage) => {
    // TODO: DRY
    dialog.showSaveDialog(
      window,
      {},
      (filePath: string) => {
        if (filePath !== undefined) {
          window.webContents.send(
            SaveProjectAsMessage.type,
            new SaveProjectAsMessage(filePath)
          )
        }
      }
    )
  })

  function refreshTitle(window: BrowserWindow) {
    let title = 'Untitled'

    if (documentState !== null) {
      if (documentState.isExampleProject) {
        title = 'Example project'
      } else if (documentState.filePath !== null) {
        title = basename(documentState.filePath)
      }

      if (documentState.hasUnsavedChanges) {
        title += ' (edited)'
      }
    }

    window.setTitle(title)
  }

  ipcMain.on(SetDocumentStateMessage.type, (_: any, message: SetDocumentStateMessage) => {
    if (documentState !== null) {
      if (message.filePath !== undefined) {
        documentState.filePath = message.filePath
      }
      if (message.hasUnsavedChanges !== undefined) {
        documentState.hasUnsavedChanges = message.hasUnsavedChanges
      }

      if (message.isExampleProject !== undefined) {
        documentState.isExampleProject = message.isExampleProject
        appMenuManager.setSaveItemEnabled(!message.isExampleProject)
      }
    }
    refreshTitle(window)
  })
}

function showDiscardChangesDialogIfNeeded(window: BrowserWindow, callback: (didCancel: boolean) => void) {
  if (documentState === null) {
    callback(false)
  }

  if (documentState!.hasUnsavedChanges) {
    let result = dialog.showMessageBox(
      window,
      {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Proceed?',
        message: 'Do you want to discard unsaved changes?'
      }
    )
    callback(result != 0)
  } else {
    callback(false)
  }
}

app.on('ready', () => createWindow())

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
