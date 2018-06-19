import { app, dialog, BrowserWindow, Menu, clipboard } from 'electron'
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage, OpenExampleProjectMessage } from './ipc-messages'
import ProjectFile from '../gui/io/project-file'
import { DocumentState } from '.'

export default class AppMenuManager {
  readonly menu: Menu
  readonly documentState: DocumentState

  constructor(documentState: DocumentState) {
    this.documentState = documentState

    let newItem = {
      label: 'New',
      accelerator: 'CommandOrControl+N',
      click: () => {
        if (this.showDiscardChangesDialogIfNeeded()) {
          BrowserWindow.getFocusedWindow().webContents.send(
            NewProjectMessage.type,
            new NewProjectMessage()
          )
        }
      }
    }

    let openItem = {
      label: 'Open',
      accelerator: 'CommandOrControl+O',
      click: () => {
        if (this.showDiscardChangesDialogIfNeeded()) {
          dialog.showOpenDialog(
            {
              filters: [
                { name: 'fSpy project files', extensions: ['fspy'] }
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
    }

    let saveItem = {
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

    let saveAsItem = {
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
      id: 'open-image',
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

    let openExampleProjectItem = {
      label: 'Open example project',
      id: 'open-example-project',
      click: () => {
        if (this.showDiscardChangesDialogIfNeeded()) {
          BrowserWindow.getFocusedWindow().webContents.send(
            OpenExampleProjectMessage.type,
            new OpenExampleProjectMessage()
          )
        }
      }
    }

    let quitMenuItem: Electron.MenuItemConstructorOptions = {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        if (this.showDiscardChangesDialogIfNeeded()) {
          app.quit()
        }
      }
    }

    let fileMenuItems: Electron.MenuItemConstructorOptions[] = [
      newItem,
      openItem,
      saveItem,
      saveAsItem,
      { type: 'separator' },
      openImageItem,
      openExampleProjectItem
    ]

    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push(quitMenuItem)
    }

    let fileMenu = {
      label: 'File',
      submenu: fileMenuItems
    }

    let menus = [fileMenu]
    if (process.env.DEV) {
      let devMenu = {
        label: 'Dev',
        submenu: [
          {
            label: 'Copy state to clipboard',
            click: () => {
              clipboard.writeText(
                JSON.stringify(ProjectFile.getStateToSave(),
                  null,
                  2
                )
              )
              console.log('Copied state to clipboard')
            }
          }
        ]
      }
      menus.push(devMenu)
    }

    if (process.platform === 'darwin') {
      menus.unshift({
        label: app.getName(),
        submenu: [
          quitMenuItem
        ]
      })
    }

    this.menu = Menu.buildFromTemplate(menus)
  }

  setOpenImageItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('open-image').enabled = enabled
  }

  setSaveItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save').enabled = enabled
  }

  setSaveAsItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save-as').enabled = enabled
  }

  private showDiscardChangesDialogIfNeeded() {
    let shouldProceed = true
    if (this.documentState.hasUnsavedChanges) {
      let choice = dialog.showMessageBox(
        BrowserWindow.getFocusedWindow(),
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Proceed',
          message: 'There are unsaved changes'
        }
      )

      shouldProceed = choice == 0
    }

    return shouldProceed
  }
}
