import { CalibrationSettings1VP } from "../types/calibration-settings";
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationSettings1VP } from "../defaults/calibration-settings";
import { CalibrationMode } from "../types/global-settings";

export function calibrationSettings1VP(state: CalibrationSettings1VP, action: AppAction): CalibrationSettings1VP {
  if (state === undefined) {
    return defaultCalibrationSettings1VP
  }

  //Early exit if the action is associated with the wrong calibration mode
  if ((action as any).calibrationMode == CalibrationMode.TwoVanishingPoints) {
    return state
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
    case ActionTypes.SET_ABSOLUTE_FOCAL_LENGTH_1VP:
      return {
        ...state,
        absoluteFocalLength: action.absoluteFocalLength
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
    case ActionTypes.SET_CAMERA_PRESET:
      return {
        ...state,
        cameraData: {
          ...state.cameraData,
          presetId: action.cameraPreset
        }
      }
    case ActionTypes.SET_CAMERA_SENSOR_SIZE:
      let oldCameraData = state.cameraData
      return {
        ...state,
        cameraData: {
          ...state.cameraData,
          customSensorWidth: action.width != undefined ? action.width : oldCameraData.customSensorWidth,
          customSensorHeight: action.height != undefined ? action.height : oldCameraData.customSensorHeight
        }
      }
  }

  return state
}