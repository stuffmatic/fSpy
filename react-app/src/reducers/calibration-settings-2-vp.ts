import { CalibrationSettings2VP } from "../types/calibration-settings";
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationSettings2VP } from "../defaults/calibration-settings";

export function calibrationSettings2VP(state: CalibrationSettings2VP, action: AppAction): CalibrationSettings2VP {
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
    case ActionTypes.SET_VANISHING_POINT_AXIS_2VP:
      let newAxes = [...state.vanishingPointAxes]
      newAxes[action.vanishingPointIndex] = action.axis
      return {
        ...state,
        vanishingPointAxes: [newAxes[0], newAxes[1]]
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_AXIS_2VP:
      return {
        ...state,
        referenceDistanceAxis: action.axis
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_2VP:
      return {
        ...state,
        referenceDistance: action.distance
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_UNIT_2VP:
      return {
        ...state,
        referenceDistanceUnit: action.unit
      }

  }

  return state
}