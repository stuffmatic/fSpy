import { CalibrationSettings1VP } from '../types/calibration-settings'
import { ActionTypes, AppAction } from '../actions'
import { defaultCalibrationSettings1VP } from '../defaults/calibration-settings'

export function calibrationSettings1VP(state: CalibrationSettings1VP | undefined, action: AppAction): CalibrationSettings1VP {
  if (state === undefined) {
    return defaultCalibrationSettings1VP
  }

  switch (action.type) {
    case ActionTypes.SET_PRINCIPAL_POINT_MODE_1VP:
      return {
        ...state,
        principalPointMode: action.principalPointMode
      }
    case ActionTypes.SET_ABSOLUTE_FOCAL_LENGTH_1VP:
      return {
        ...state,
        absoluteFocalLength: action.absoluteFocalLength
      }
    case ActionTypes.LOAD_STATE:
      return action.savedState.calibrationSettings1VP
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultCalibrationSettings1VP
  }

  return state
}
