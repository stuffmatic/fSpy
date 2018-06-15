// Messages sent from the renderer process to the main process

export class SpecifyProjectPathMessage {
  static readonly type = 'SpecifyProjectPathMessage'
}

export class SetDocumentStateMessage {
  static readonly type = 'SetDocumentStateMessage'
  readonly hasUnsavedChanges: boolean | undefined
  readonly filePath: string | null | undefined
  readonly isExampleProject: boolean | undefined
  constructor(
    hasUnsavedChanges: boolean | undefined,
    filePath: string | null | undefined,
    isExampleProject: boolean | undefined
  ) {
    this.hasUnsavedChanges = hasUnsavedChanges
    this.filePath = filePath
    this.isExampleProject = isExampleProject
  }
}
