import { ActionTypes, AppAction } from '../actions'
import { UIState } from '../types/ui-state'
import { defaultUIState } from '../defaults/ui-state'

export function uiState(state: UIState | undefined, action: AppAction): UIState {
  if (state === undefined) {
    return defaultUIState
  }

  switch (action.type) {
    case ActionTypes.SET_EXPORT_DIALOG_VISIBILITY:
      return {
        ...state,
        isExportDialogOpen: action.isVisible
      }
  }

  return state
}
