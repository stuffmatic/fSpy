import { app, dialog } from 'electron'

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
              //
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
              console.log(filePaths)
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
