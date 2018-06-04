import { app, BrowserWindow, Menu } from 'electron'
import menuTemplate from './menu-template'
import { OpenImageMessage } from './messages'
const path = require('path')
const url = require('url')

let mainWindow: Electron.BrowserWindow | null

function createWindow() {
  let window = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    width: 800,
    height: 600,
    show: false
  })
  mainWindow = window

  window.on('ready-to-show', () => {
    window.show()
    window.focus()
    if (process.env.DEV) {
      window.webContents.openDevTools({ mode: 'bottom' })
      // load a test image
      window.webContents.send(
        OpenImageMessage.type,
        new OpenImageMessage(path.join(__dirname, '../test_data/box.jpg'))
      )
    }
  })

  const startUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const devUrl = 'http://localhost:8080'

  window.loadURL(process.env.DEV ? devUrl : startUrl)

  let menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // Emitted when the window is closed.
  window.on('closed', () => {
    mainWindow = null
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
