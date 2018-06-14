// Messages sent from the renderer process to the main process

export class SpecifyProjectPathMessage {
  static readonly type = 'SpecifyProjectPathMessage'
}

export class SetNeedsSaveFlagMessage {
  static readonly type = 'SetNeedsSaveFlagMessage'
  readonly flag: boolean
  constructor(flag: boolean) {
    this.flag = flag
  }
}
