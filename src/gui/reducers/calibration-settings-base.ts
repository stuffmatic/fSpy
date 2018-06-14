import { CalibrationSettingsBase } from '../types/calibration-settings'
import { defaultCalibrationSettingsBase } from '../defaults/calibration-settings'
import { ActionTypes, AppAction } from '../actions'

export function calibrationSettingsBase(state: CalibrationSettingsBase | undefined, action: AppAction): CalibrationSettingsBase {
  if (state === undefined) {
    return defaultCalibrationSettingsBase
  }

  switch (action.type) {
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
    case ActionTypes.SET_FIRST_VANISHING_POINT_AXIS:
      return {
        ...state,
        firstVanishingPointAxis: action.axis
      }
    case ActionTypes.SET_SECOND_VANISHING_POINT_AXIS:
      return {
        ...state,
        secondVanishingPointAxis: action.axis
      }
    case ActionTypes.LOAD_SAVED_STATE:
      return action.savedState.calibrationSettingsBase
  }

  return state
}
