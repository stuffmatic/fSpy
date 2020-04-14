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

import { ActionTypes, AppAction } from '../actions'
import { UIState } from '../types/ui-state'
import { defaultUIState } from '../defaults/ui-state'
import { ipcRenderer } from 'electron'
import { SetDocumentStateMessage } from '../ipc-messages'

export function uiState(state: UIState | undefined, action: AppAction): UIState {
  if (state === undefined) {
    return defaultUIState
  }

  // TODO: move these ipc calls somewhere else?

  switch (action.type) {
    case ActionTypes.SET_PROJECT_HAS_UNSAVED_CHANGES:
      ipcRenderer.send(
        SetDocumentStateMessage.type,
        new SetDocumentStateMessage(true, undefined, undefined)
      )
      return {
        ...state,
        projectHasUnsavedChanges: true
      }
    case ActionTypes.SET_PROJECT_FILE_PATH:
      ipcRenderer.send(
        SetDocumentStateMessage.type,
        new SetDocumentStateMessage(false, action.projectFilePath, false)
      )
      return {
        ...state,
        projectFilePath: action.projectFilePath
      }
    case ActionTypes.LOAD_DEFAULT_STATE:
      ipcRenderer.send(
        SetDocumentStateMessage.type,
        new SetDocumentStateMessage(false, null, false)
      )
      return {
        ...state,
        projectHasUnsavedChanges: false,
        projectFilePath: null
      }
    case ActionTypes.SET_SIDE_PANEL_VISIBILITY:
      return {
        ...state,
        sidePanelsAreVisible: action.panelsAreVisible
      }
    case ActionTypes.LOAD_STATE:
      ipcRenderer.send(
        SetDocumentStateMessage.type,
        new SetDocumentStateMessage(
          false,
          action.projectFilePath,
          action.isExampleProject
        )
      )
      return {
        ...state,
        projectHasUnsavedChanges: false,
        projectFilePath: action.isExampleProject ? null : action.projectFilePath
      }
  }

  return state
}
