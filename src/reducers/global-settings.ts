import { AppAction, ActionTypes } from "../actions";
import { GlobalSettings } from "../types/global-settings";
import { defaultGlobalSettings } from "../defaults/global-settings";

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
    case ActionTypes.SET_GRID_FLOOR_NORMAL:
      return {
        ...state,
        gridFloorNormal: action.axis
      }
  }

  return state;
}