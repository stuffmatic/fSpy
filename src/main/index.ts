import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage, ExportMessage, ExportType } from './ipc-messages'
const path = require('path')
const url = require('url')

import windowStateKeeper from 'electron-window-state'
import { SpecifyProjectPathMessage, SpecifyExportPathMessage, SetDocumentStateMessage, OpenDroppedProjectMessage } from '../gui/ipc-messages'
import { basename, join } from 'path'
import AppMenuManager from './app-menu-manager'
import ProjectFile from '../gui/io/project-file'
import { Palette } from '../gui/style/palette'
import { openSync, writeSync, closeSync } from 'fs'

let mainWindow: Electron.BrowserWindow | null = null

export interface DocumentState {
  hasUnsavedChanges: boolean
  filePath: string | null,
  isExampleProject: boolean
}

let documentState: DocumentState | null = null

let initialOpenMessage: OpenProjectMessage | null = null
let windowHasAppeared = false

// macOS only
app.on('open-file', (event: Event, filePath: string) => {
  if (mainWindow === null) {
    initialOpenMessage = new OpenProjectMessage(filePath, false)
    if (windowHasAppeared) {
      // The main window has appeared at least once but there is
      // currently no window. Create one
      createWindow()
    }
  } else {
    showDiscardChangesDialogIfNeeded(mainWindow, (didCancel: boolean) => {
      event.preventDefault()
      if (!didCancel) {
        openProject(filePath, mainWindow!)
      }
    })
  }
})

function openProject(path: string, window: BrowserWindow) {
  app.addRecentDocument(path)
  window.webContents.send(
    OpenProjectMessage.type,
    new OpenProjectMessage(path, false)
  )
}

function createWindow() {
  const minWidth = 800
  const minHeight = 768
  let mainWindowState = windowStateKeeper({
    defaultWidth: minWidth,
    defaultHeight: minHeight
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
    minWidth: minWidth,
    minHeight: minHeight,
    show: false,
    icon: windowIconPath,
    backgroundColor: Palette.lightGray,
    webPreferences: {
      // Allow loading local files in dev mode
      webSecurity: process.env.DEV === undefined
    }
  })

  mainWindowState.manage(window)
  mainWindow = window

  let appMenuManager = new AppMenuManager(
    {
      onNewProject: () => {
        if (mainWindow) {
          showDiscardChangesDialogIfNeeded(mainWindow, (didCancel: boolean) => {
            if (!didCancel) {
              window.webContents.send(
                NewProjectMessage.type,
                new NewProjectMessage()
              )
            }
          })
        } else {
          createWindow()
        }
      },
      onOpenProject: () => {
        showDiscardChangesDialogIfNeeded(mainWindow, (didCancel: boolean) => {
          if (!didCancel) {
            if (mainWindow) {
              dialog.showOpenDialog(
                mainWindow,
                {
                  filters: [
                    { name: 'fSpy project files', extensions: ['fspy'] }
                  ],
                  properties: ['openFile']
                },
                (filePaths: string[]) => {
                  if (filePaths !== undefined) {
                    openProject(filePaths[0], window)
                  }
                }
              )
            } else {
              dialog.showOpenDialog(
                {
                  filters: [
                    { name: 'fSpy project files', extensions: ['fspy'] }
                  ],
                  properties: ['openFile']
                },
                (filePaths: string[]) => {
                  if (filePaths !== undefined) {
                    initialOpenMessage = new OpenProjectMessage(filePaths[0], false)
                    createWindow()
                  }
                }
              )
            }
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
        showDiscardChangesDialogIfNeeded(mainWindow, (didCancel: boolean) => {
          if (!didCancel) {
            let projectPath = ProjectFile.exampleProjectPath
            if (mainWindow) {
              window.webContents.send(
                OpenProjectMessage.type,
                new OpenProjectMessage(projectPath, true)
              )
            } else {
              initialOpenMessage = new OpenProjectMessage(projectPath, true)
              createWindow()
            }
          }
        })
      },
      onExportJSON: () => {
        window.webContents.send(
          ExportMessage.type,
          new ExportMessage(ExportType.CameraParametersJSON)
        )
      },
      onExportProjectImage: () => {
        window.webContents.send(
          ExportMessage.type,
          new ExportMessage(ExportType.ProjectImage)
        )
      },
      onQuit: () => {
        app.quit()
      }
    }
  )

  // Prevent (macos) zooming
  let webContents = window.webContents
  webContents.on('did-finish-load', () => {
    webContents.setZoomFactor(1)
    webContents.setVisualZoomLevelLimits(1, 1)
    webContents.setLayoutZoomLevelLimits(0, 0)
  })

  // Prevent following links, e.g when they are dropped
  // on the app window
  window.webContents.on('will-navigate', ev => {
    if (process.env.DEV) {
      // Allow this event in dev builds, since auto reload
      // relies on it
    } else {
      ev.preventDefault()
    }
  })

  window.on('ready-to-show', () => {
    refreshTitle(window)
    window.show()
    window.focus()
    windowHasAppeared = true

    documentState = {
      hasUnsavedChanges: false,
      filePath: null,
      isExampleProject: false
    }

    if (initialOpenMessage) {
      window.webContents.send(
        OpenProjectMessage.type,
        new OpenProjectMessage(initialOpenMessage.filePath, true)
      )
    }

    if (process.env.DEV) {
      // show dev tools
      window.webContents.openDevTools({ mode: 'bottom' })
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
        ipcMain.removeAllListeners(SpecifyExportPathMessage.type)
        ipcMain.removeAllListeners(OpenDroppedProjectMessage.type)
        appMenuManager.setOpenImageItemEnabled(false)
        appMenuManager.setSaveAsItemEnabled(false)
        appMenuManager.setSaveItemEnabled(false)
        mainWindow = null
        documentState = null
        initialOpenMessage = null
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

  ipcMain.on(SpecifyExportPathMessage.type, (_: any, message: SpecifyExportPathMessage) => {
    // TODO: DRY
    dialog.showSaveDialog(
      window,
      {},
      (filePath: string) => {
        if (filePath !== undefined) {
          let file = openSync(filePath, 'w')
          writeSync(file, message.data)
          closeSync(file)
        }
      }
    )
  })

  ipcMain.on(OpenDroppedProjectMessage.type, (_: any, message: OpenDroppedProjectMessage) => {
    showDiscardChangesDialogIfNeeded(window, (didCancel: boolean) => {
      if (!didCancel) {
        openProject(message.filePath, window)
      }
    })
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
        if (process.platform !== 'darwin') {
          title += ' (modified)'
        } else {
          // using window.setDocumentEdited on mac
        }
      }

      if (documentState.filePath) {
        window.setRepresentedFilename(documentState.filePath)
      } else {
        window.setRepresentedFilename('')
      }

      window.setDocumentEdited(documentState.hasUnsavedChanges)
    }

    if (process.platform !== 'darwin') {
      title += ' - fSpy'
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

function showDiscardChangesDialogIfNeeded(
  window: BrowserWindow | null,
  callback: (didCancel: boolean) => void
) {
  if (documentState === null) {
    callback(false)
    return
  }

  if (window === null) {
    callback(false)
    return
  }

  if (documentState.hasUnsavedChanges) {
    let result = dialog.showMessageBox(
      window!,
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
