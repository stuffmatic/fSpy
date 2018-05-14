import { CalibrationSettings1VP } from "../types/calibration-settings";
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationSettings1VP } from "../defaults/calibration-settings";

export function calibrationSettings1VP(state: CalibrationSettings1VP, action: AppAction): CalibrationSettings1VP {
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
    case ActionTypes.SET_VANISHING_POINT_AXIS_1VP:
      return {
        ...state,
        vanishingPointAxis: action.axis
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_AXIS_1VP:
      return {
        ...state,
        referenceDistanceAxis: action.axis
      }
  }

  return state
}