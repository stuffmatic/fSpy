import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage, OpenExampleProjectMessage } from './ipc-messages'
const path = require('path')
const url = require('url')

import windowStateKeeper from 'electron-window-state'
import { SpecifyProjectPathMessage, SetDocumentStateMessage } from '../gui/ipc-messages'
import { basename } from 'path'
import AppMenuManager from './app-menu-manager'

let mainWindow: Electron.BrowserWindow | null

export interface DocumentState {
  hasUnsavedChanges: boolean
  filePath: string | null,
  isExampleProject: boolean
}

let documentState: DocumentState = {
  hasUnsavedChanges: false,
  filePath: null,
  isExampleProject: false
}

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600
  })

  let window = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 600,
    show: false
  })
  mainWindowState.manage(window)
  mainWindow = window

  let appMenuManager = new AppMenuManager(
    {
      onNewProject: () => {
        showDiscardChangesDialogIfNeeded(() => {
          window.webContents.send(
            NewProjectMessage.type,
            new NewProjectMessage()
          )
        })
      },
      onOpenProject: () => {
        showDiscardChangesDialogIfNeeded(() => {
          dialog.showOpenDialog(
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
        showDiscardChangesDialogIfNeeded(() => {
          window.webContents.send(
            OpenExampleProjectMessage.type,
            new OpenExampleProjectMessage()
          )
        })
      },
      onQuit: () => {
        showDiscardChangesDialogIfNeeded(() => {
          app.quit()
        })
      }
    }
  )

  window.on('ready-to-show', () => {
    refreshTitle()
    window.show()
    window.focus()

    if (process.env.DEV) {
      // show dev tools
      window.webContents.openDevTools({ mode: 'bottom' })
      // load a test image
      /*window.webContents.send(
        OpenImageMessage.type,
        new OpenImageMessage(path.join(__dirname, '../test_data/box.jpg'))
      )*/
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

  // Emitted when the window is closed.
  window.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on(SpecifyProjectPathMessage.type, (_: any, __: SpecifyProjectPathMessage) => {
    // TODO: DRY
    dialog.showSaveDialog(
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

  function showDiscardChangesDialogIfNeeded(callback: () => void) {
    if (documentState.hasUnsavedChanges) {
      let result = dialog.showMessageBox(
        window,
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Proceed?',
          message: 'Do you want to discard unsaved changes?'
        }
      )
      if (result == 0) {
        callback()
      }
    } else {
      callback()
    }
  }

  function refreshTitle() {
    let title = 'Untitled'

    if (documentState.isExampleProject) {
      title = 'Example project'
    } else if (documentState.filePath !== null) {
      title = basename(documentState.filePath)
    }

    if (documentState.hasUnsavedChanges) {
      title += ' (edited)'
    }

    window.setTitle(title)
  }

  ipcMain.on(SetDocumentStateMessage.type, (_: any, message: SetDocumentStateMessage) => {
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
    refreshTitle()
  })
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
