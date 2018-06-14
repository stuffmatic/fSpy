import { ActionTypes, AppAction } from '../actions'
import { GlobalSettings } from './../types/global-settings'
import { defaultGlobalSettings } from './../defaults/global-settings'

export function globalSettings(state: GlobalSettings | undefined, action: AppAction): GlobalSettings {
  if (state === undefined) {
    return defaultGlobalSettings
  }

  switch (action.type) {
    case ActionTypes.SET_CALIBRATION_MODE:
      return {
        ...state,
        calibrationMode: action.calibrationMode
      }
    case ActionTypes.SET_IMAGE_OPACITY:
      return {
        ...state,
        imageOpacity: action.opacity
      }
    case ActionTypes.SET_OVERLAY_3D_GUIDE:
      return {
        ...state,
        overlay3DGuide: action.overlay3DGuide
      }
    case ActionTypes.LOAD_SAVED_STATE:
      return action.savedState.globalSettings
  }

  return state
}
