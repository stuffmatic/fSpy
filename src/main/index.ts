import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import appMenuManager from './app-menu-manager'
import { OpenImageMessage, SaveProjectAsMessage, OpenProjectMessage } from './ipc-messages'
const path = require('path')
const url = require('url')

import windowStateKeeper from 'electron-window-state'
import { SpecifyProjectPathMessage, SetNeedsSaveFlagMessage } from '../gui/ipc-messages'

let mainWindow: Electron.BrowserWindow | null

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

  window.on('ready-to-show', () => {
    app.on('open-file', (_: Event, path: string) => {
      window.webContents.send(
        OpenImageMessage.type,
        new OpenProjectMessage(path)
      )
    })
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
          BrowserWindow.getFocusedWindow().webContents.send(
            SaveProjectAsMessage.type,
            new SaveProjectAsMessage(filePath)
          )
        }
      }
    )
  })

  ipcMain.on(SetNeedsSaveFlagMessage.type, (_: any, __: SpecifyProjectPathMessage) => {
    window.setTitle('needs saving')
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
