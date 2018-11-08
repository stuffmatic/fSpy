
// Messages sent from the main process to the renderer process

export class NewProjectMessage {
  static readonly type = 'newProject'
}

export class OpenProjectMessage {
  static readonly type = 'openProject'
  readonly filePath: string
  readonly isExampleProject: boolean

  constructor(filePath: string, isExampleProject: boolean) {
    this.filePath = filePath
    this.isExampleProject = isExampleProject
  }
}

export class SaveProjectMessage {
  static readonly type = 'saveProject'
}

export class SaveProjectAsMessage {
  static readonly type = 'saveProjectAs'
  readonly filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }
}

export class OpenImageMessage {
  static readonly type = 'openImage'
  readonly filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }
}

export enum ExportType {
  CameraParametersJSON,
  ProjectImage
}

export class ExportMessage {
  static readonly type = 'export'
  readonly exportType: ExportType

  constructor(exportType: ExportType) {
    this.exportType = exportType
  }
}
