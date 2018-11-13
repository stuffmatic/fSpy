import { ActionTypes, AppAction } from '../actions'
import { ResultDisplaySettings } from '../types/result-display-settings'
import { defaultResultDisplaySettings } from '../defaults/result-display-settings'

export function resultDisplaySettings(state: ResultDisplaySettings | undefined, action: AppAction): ResultDisplaySettings {
  if (state === undefined) {
    return defaultResultDisplaySettings
  }

  switch (action.type) {
    case ActionTypes.SET_FOV_DISPLAY_FORMAT:
      return {
        ...state,
        fieldOfViewFormat: action.displayFormat
      }
    case ActionTypes.SET_ORIENTATION_DISPLAY_FORMAT:
      return {
        ...state,
        orientationFormat: action.displayFormat
      }
    case ActionTypes.SET_PRINCIPAL_POINT_DISPLAY_FORMAT:
      return {
        ...state,
        principalPointFormat: action.displayFormat
      }
    case ActionTypes.SET_DISPLAY_ABSOLUTE_FOCAL_LENGTH:
      return {
        ...state,
        displayAbsoluteFocalLength: action.displayAbsoluteFocalLength
      }
    case ActionTypes.LOAD_STATE:
      return {
        ...state,
        ...action.savedState.resultDisplaySettings
      }
  }

  return state
}
