import { CalibrationSettings1VP } from '../types/calibration-settings'
import { ActionTypes } from '../actions'
import { defaultCalibrationSettings1VP } from '../defaults/calibration-settings'
import { AnyAction } from 'redux'

export function calibrationSettings1VP(state: CalibrationSettings1VP | undefined, action: AnyAction): CalibrationSettings1VP {
  if (state === undefined) {
    return defaultCalibrationSettings1VP
  }

  switch (action.type) {
    case ActionTypes.SET_PRINCIPAL_POINT_MODE_1VP:
      return {
        ...state,
        principalPointMode: action.principalPointMode
      }
    case ActionTypes.SET_HORIZON_MODE:
      return {
        ...state,
        horizonMode: action.horizonMode
      }
    case ActionTypes.SET_ABSOLUTE_FOCAL_LENGTH_1VP:
      return {
        ...state,
        absoluteFocalLength: action.absoluteFocalLength
      }
    case ActionTypes.LOAD_SAVED_STATE:
      return action.savedState.calibrationSettings1VP
  }

  return state
}
