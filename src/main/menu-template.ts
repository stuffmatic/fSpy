import { app, dialog, BrowserWindow } from 'electron'
import { OpenProjectMessage, OpenImageMessage } from './messages'

let fileMenu: Electron.MenuItemConstructorOptions = {
  label: 'File',
  submenu: [
    {
      label: 'Open project',
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
    },
    {
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
    },
    {
      label: 'Save',
      accelerator: 'CommandOrControl+S',
      click: () => {
        //
      }
    },
    {
      label: 'Save as',
      accelerator: 'CommandOrControl+Shift+S',
      click: () => {
        //
      }
    }
  ]
}

let menuTemplate: Electron.MenuItemConstructorOptions[] = [
  fileMenu
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => { app.quit() }
      }
    ]
  })
}

export default menuTemplate
