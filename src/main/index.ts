import { app, BrowserWindow } from 'electron'
const path = require('path')
const url = require('url')

let mainWindow: Electron.BrowserWindow

function onReady() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  const startUrl = url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  })

  const devUrl = 'http://localhost:8080'

  mainWindow.loadURL(process.env.DEV ? devUrl : startUrl)
  mainWindow.on('close', () => app.quit())
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
console.log(`Electron Version ${app.getVersion()}`)
