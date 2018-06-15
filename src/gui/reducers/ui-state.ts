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
    case ActionTypes.SET_EXPORT_DIALOG_VISIBILITY:
      return {
        ...state,
        isExportDialogOpen: action.isVisible
      }
    case ActionTypes.SET_PROJECT_HAS_UNSAVED_CHANGES:
      ipcRenderer.send(
        SetDocumentStateMessage.type,
        new SetDocumentStateMessage(true, undefined, undefined)
      )
      return {
        ...state,
        projectHasUnsavedChanges: true
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
