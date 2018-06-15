
// Messages sent from the main process to the renderer process

export class NewProjectMessage {
  static readonly type = 'newProject'
}

export class OpenProjectMessage {
  static readonly type = 'openProject'
  readonly filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
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

export class OpenExampleProjectMessage {
  static readonly type = 'openExampleProject'
}
