/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage, ExportMessage, ExportType, SetSidePanelVisibilityMessage } from './ipc-messages'
const path = require('path')
const url = require('url')

import windowStateKeeper from 'electron-window-state'
import { SpecifyProjectPathMessage, SpecifyExportPathMessage, SetDocumentStateMessage, OpenDroppedProjectMessage } from '../gui/ipc-messages'
import { basename, join } from 'path'
import AppMenuManager from './app-menu-manager'
import ProjectFile from '../gui/io/project-file'
import { Palette } from '../gui/style/palette'
import { openSync, writeSync, closeSync } from 'fs'
import { CLI } from '../cli/cli'

app.allowRendererProcessReuse = true

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
    backgroundColor: Palette.imagePanelBackgroundColor,
    webPreferences: {
      // Allow loading local files in dev mode
      webSecurity: process.env.DEV === undefined,
      nodeIntegration: true
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
                }
              ).then((result) => {
                if (!result.canceled) {
                  openProject(result.filePaths[0], window)
                }
              }).catch((_) => {
                //
              })
            } else {
              dialog.showOpenDialog(
                {
                  filters: [
                    { name: 'fSpy project files', extensions: ['fspy'] }
                  ],
                  properties: ['openFile']
                }
              ).then((result) => {
                if (!result.canceled) {
                  initialOpenMessage = new OpenProjectMessage(result.filePaths[0], false)
                  createWindow()
                }
              }).catch((_) => {
                //
              })
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
          {}
        ).then((result) => {
          if (!result.canceled && result.filePath !== undefined) {
            window.webContents.send(
              SaveProjectAsMessage.type,
              new SaveProjectAsMessage(result.filePath)
            )
          }
        }).catch((_) => {
          //
        })
      },
      onOpenImage: () => {
        dialog.showOpenDialog(
          window,
          {
            properties: ['openFile']
          }
        ).then((result) => {
          if (!result.canceled) {
            window.webContents.send(
              OpenImageMessage.type,
              new OpenImageMessage(result.filePaths[0])
            )
          }
        }).catch((_) => {
          //
        })
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
      },
      onEnterFullScreenMode: () => {
        window.webContents.send(
          SetSidePanelVisibilityMessage.type,
          new SetSidePanelVisibilityMessage(false)
        )
        window.setFullScreen(true)
      },
      onExitFullScreenMode: () => {
        window.webContents.send(
          SetSidePanelVisibilityMessage.type,
          new SetSidePanelVisibilityMessage(true)
        )
        window.setFullScreen(false)
      }
    }
  )

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
        new OpenProjectMessage(initialOpenMessage.filePath, false)
      )
    } else {
      // Check if an image or project path was passed as an argument
      const argCount = process.argv.length
      const openCommand = process.argv[argCount - 2]
      const filePath = process.argv[argCount - 1]
      if (openCommand == 'open' && filePath) {
        try {
          // Make sure the file can be opened before proceeding
          const fd = openSync(filePath, 'r')
          closeSync(fd)

          if (ProjectFile.isProjectFile(filePath)) {
            window.webContents.send(
              OpenProjectMessage.type,
              new OpenProjectMessage(filePath, false)
            )
          } else {
            window.webContents.send(
              OpenImageMessage.type,
              new OpenImageMessage(filePath)
            )
          }
        } catch (error) {
          console.log(error)
          console.log('process.argv:')
          console.log(process.argv)

          const errorMessage = 'Failed to open \'' + filePath + '\'. ' + error
          dialog.showMessageBoxSync(window, {
            message: errorMessage
          })
        }
      }
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

  window.loadURL(
    process.env.DEV ? devUrl : startUrl
  ).then((_) => {
    //
  }).catch((_) => {
    //
  })

  Menu.setApplicationMenu(appMenuManager.menu)
  appMenuManager.setExitFullScreenItemEnabled(false)

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
        appMenuManager.setEnterFullScreenItemEnabled(false)
        appMenuManager.setExitFullScreenItemEnabled(false)
        mainWindow = null
        documentState = null
        initialOpenMessage = null
      }
    })
  })

  window.on('enter-full-screen', (_: Event) => {
    appMenuManager.setEnterFullScreenItemEnabled(false)
    appMenuManager.setExitFullScreenItemEnabled(true)
    window.setMenuBarVisibility(false)
  })

  window.on('leave-full-screen', (_: Event) => {
    window.webContents.send(
      SetSidePanelVisibilityMessage.type,
      new SetSidePanelVisibilityMessage(true)
    )
    appMenuManager.setEnterFullScreenItemEnabled(true)
    appMenuManager.setExitFullScreenItemEnabled(false)
    window.setMenuBarVisibility(true)
  })

  ipcMain.on(SpecifyProjectPathMessage.type, (_: any, __: SpecifyProjectPathMessage) => {
    // TODO: DRY
    dialog.showSaveDialog(
      window,
      {}
    ).then((result) => {
      if (!result.canceled && result.filePath) {
        window.webContents.send(
          SaveProjectAsMessage.type,
          new SaveProjectAsMessage(result.filePath)
        )
      }
    }).catch((_) => {
      //
    })
  })

  ipcMain.on(SpecifyExportPathMessage.type, (_: any, message: SpecifyExportPathMessage) => {
    // TODO: DRY
    dialog.showSaveDialog(
      window,
      {}
    ).then((result) => {
      if (!result.canceled && result.filePath) {
        let file = openSync(result.filePath, 'w')
        writeSync(file, message.data)
        closeSync(file)
      }
    }).catch((_) => {
      //
    })
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
    let result = dialog.showMessageBoxSync(
      window!,
      {
        type: 'question',
        buttons: ['Discard', 'Cancel'],
        title: 'Proceed?',
        message: 'Do you want to discard unsaved changes?'
      }
    )
    callback(result != 0)
  } else {
    callback(false)
  }
}

app.on('ready', () => {
  // Assume we're in CLI mode if any argument starts
  // with '-' or equals 'help'
  let isCli = false
  const args = process.argv
  for (const arg of args) {
    if (['-w', '-h', '-s', '-o', '-h', '--help', 'help'].indexOf(arg) >= 0) {
      isCli = true
      break
    }
  }

  if (isCli) {
    // We're in CLI mode. Run the CLI and exit
    CLI.run(process.argv)
    process.exit()
  } else {
    // We're in GUI mode.
    createWindow()
  }
})

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
