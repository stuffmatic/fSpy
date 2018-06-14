import { CalibrationSettings2VP } from '../types/calibration-settings'
import { ActionTypes, AppAction } from '../actions'
import { defaultCalibrationSettings2VP } from '../defaults/calibration-settings'

export function calibrationSettings2VP(state: CalibrationSettings2VP | undefined, action: AppAction): CalibrationSettings2VP {
  if (state === undefined) {
    return defaultCalibrationSettings2VP
  }

  switch (action.type) {
    case ActionTypes.SET_PRINCIPAL_POINT_MODE_2VP:
      return {
        ...state,
        principalPointMode: action.principalPointMode
      }
    case ActionTypes.SET_QUAD_MODE_ENABLED:
      return {
        ...state,
        quadModeEnabled: action.quadModeEnabled
      }
    case ActionTypes.LOAD_SAVED_STATE:
      return action.savedState.calibrationSettings2VP
  }

  return state
}
