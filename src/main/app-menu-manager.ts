import { app, dialog, BrowserWindow, Menu } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage } from './ipc-messages'

export class AppMenuManager {
  readonly menu: Menu
  readonly fileMenu: Electron.MenuItemConstructorOptions
  readonly menuTemplate: Electron.MenuItemConstructorOptions[]
  readonly saveItem: Electron.MenuItemConstructorOptions
  readonly saveAsItem: Electron.MenuItemConstructorOptions

  constructor() {

    let newItem = {
      label: 'New',
      accelerator: 'CommandOrControl+N',
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.send(
          NewProjectMessage.type,
          new NewProjectMessage()
        )
      }
    }

    let openItem = {
      label: 'Open',
      accelerator: 'CommandOrControl+O',
      click: () => {
        dialog.showOpenDialog(
          {
            filters: [
              { name: 'f-Spy project files', extensions: ['fspy'] }
            ],
            properties: ['openFile']
          },
          (filePaths: string[]) => {
            if (filePaths !== undefined) {
              BrowserWindow.getFocusedWindow().webContents.send(
                OpenProjectMessage.type,
                new OpenProjectMessage(filePaths[0])
              )
            }
          }
        )
      }
    }

    this.saveItem = {
      label: 'Save',
      id: 'save',
      accelerator: 'CommandOrControl+S',
      click: () => {
        BrowserWindow.getFocusedWindow().webContents.send(
          SaveProjectMessage.type,
          new SaveProjectMessage()
        )
      }
    }

    this.saveAsItem = {
      label: 'Save as',
      id: 'save-as',
      accelerator: 'CommandOrControl+Shift+S',
      click: () => {
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
      }
    }

    let openImageItem = {
      label: 'Open image',
      accelerator: 'CommandOrControl+Shift+O',
      click: () => {
        dialog.showOpenDialog(
          {
            properties: ['openFile']
          },
          (filePaths: string[]) => {
            if (filePaths !== undefined) {
              BrowserWindow.getFocusedWindow().webContents.send(
                OpenImageMessage.type,
                new OpenImageMessage(filePaths[0])
              )
            }
          }
        )
      }
    }

    let quitMenuItem: Electron.MenuItemConstructorOptions = {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => { app.quit() }
    }

    let fileMenuItems: Electron.MenuItemConstructorOptions[] = [
      newItem,
      openItem,
      this.saveItem,
      this.saveAsItem,
      { type: 'separator' },
      openImageItem
    ]

    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push(quitMenuItem)
    }

    this.fileMenu = {
      label: 'File',
      submenu: fileMenuItems
    }

    this.menuTemplate = [
      this.fileMenu
    ]

    if (process.platform === 'darwin') {
      this.menuTemplate.unshift({
        label: app.getName(),
        submenu: [
          quitMenuItem
        ]
      })
    }

    this.menu = Menu.buildFromTemplate(this.menuTemplate)
  }

  setSaveItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save').enabled = enabled
  }

  setSaveAsItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save-as').enabled = enabled
  }
}

const appMenuManager = new AppMenuManager()
export default appMenuManager
