/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

export class SetSidePanelVisibilityMessage {
  static readonly type = 'setSidePanelVisibility'
  readonly panelsAreVisible: boolean

  constructor(panelsAreVisible: boolean) {
    this.panelsAreVisible = panelsAreVisible
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
