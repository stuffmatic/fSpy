import { GlobalSettings } from "../types/store-state";
import { AppAction, ActionTypes } from "../actions";
import { defaultGlobalSettings } from "../types/defaults";

export function globalSettings(state: GlobalSettings, action: AppAction): GlobalSettings {
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
  }

  return state;
}