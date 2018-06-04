
// Messages sent from the main process to the renderer process

export class OpenProjectMessage {
  static readonly type = 'openProject'
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
