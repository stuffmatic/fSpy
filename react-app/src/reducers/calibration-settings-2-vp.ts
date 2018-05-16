import { CalibrationSettings2VP } from "../types/calibration-settings";
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationSettings2VP } from "../defaults/calibration-settings";
import { CalibrationMode } from "../types/global-settings";

export function calibrationSettings2VP(state: CalibrationSettings2VP, action: AppAction): CalibrationSettings2VP {
  if (state === undefined) {
    return defaultCalibrationSettings2VP
  }

  //Early exit if the action is associated with the wrong calibration mode
  if ((action as any).calibrationMode == CalibrationMode.OneVanishingPoint) {
    return state
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
    case ActionTypes.SET_REFERENCE_DISTANCE_AXIS:
      return {
        ...state,
        referenceDistanceAxis: action.axis
      }
    case ActionTypes.SET_REFERENCE_DISTANCE:
      return {
        ...state,
        referenceDistance: action.distance
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_UNIT:
      return {
        ...state,
        referenceDistanceUnit: action.unit
      }

  }

  return state
}