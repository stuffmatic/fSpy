import { contextBridge, ipcRenderer, webUtils } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Request-response (invoke)
  showErrorBox: (title: string, content: string): Promise<void> => {
    return ipcRenderer.invoke('show-error-box', title, content)
  },
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version')
  },
  readFile: (filePath: string): Promise<Uint8Array> => {
    return ipcRenderer.invoke('read-file', filePath)
  },
  writeFile: (filePath: string, data: Uint8Array): Promise<void> => {
    return ipcRenderer.invoke('write-file', filePath, data)
  },
  isProjectFile: (filePath: string): Promise<boolean> => {
    return ipcRenderer.invoke('is-project-file', filePath)
  },
  getResourceURL: (fileName: string): Promise<string> => {
    return ipcRenderer.invoke('get-resource-url', fileName)
  },
  getResourcePath: (fileName: string): Promise<string> => {
    return ipcRenderer.invoke('get-resource-path', fileName)
  },

  // Fire-and-forget (renderer → main)
  sendSetDocumentState: (
    hasUnsavedChanges: boolean | undefined,
    filePath: string | null | undefined,
    isExampleProject: boolean | undefined
  ): void => {
    ipcRenderer.send('SetDocumentStateMessage', {
      hasUnsavedChanges,
      filePath,
      isExampleProject
    })
  },
  sendSpecifyProjectPath: (): void => {
    ipcRenderer.send('SpecifyProjectPathMessage', {})
  },
  sendOpenDroppedProject: (filePath: string): void => {
    ipcRenderer.send('OpenDroppedProjectMessage', { filePath })
  },
  sendSpecifyExportPath: (exportType: number, data: unknown): void => {
    ipcRenderer.send('SpecifyExportPathMessage', { exportType, data })
  },

  // Listeners (main → renderer)
  onNewProject: (callback: () => void): void => {
    ipcRenderer.on('newProject', () => callback())
  },
  onOpenProject: (callback: (filePath: string, isExampleProject: boolean) => void): void => {
    ipcRenderer.on('openProject', (_event, message) => {
      callback(message.filePath, message.isExampleProject)
    })
  },
  onSaveProject: (callback: () => void): void => {
    ipcRenderer.on('saveProject', () => callback())
  },
  onSaveProjectAs: (callback: (filePath: string) => void): void => {
    ipcRenderer.on('saveProjectAs', (_event, message) => callback(message.filePath))
  },
  onOpenImage: (callback: (filePath: string) => void): void => {
    ipcRenderer.on('openImage', (_event, message) => callback(message.filePath))
  },
  onExport: (callback: (exportType: number) => void): void => {
    ipcRenderer.on('export', (_event, message) => callback(message.exportType))
  },
  onSetSidePanelVisibility: (callback: (panelsAreVisible: boolean) => void): void => {
    ipcRenderer.on('setSidePanelVisibility', (_event, message) => {
      callback(message.panelsAreVisible)
    })
  },

  // Clipboard
  writeClipboardText: (text: string): void => {
    ipcRenderer.invoke('write-clipboard-text', text)
  },

  // File utilities
  getPathForFile: (file: File): string => {
    return webUtils.getPathForFile(file)
  }
})
