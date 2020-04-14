/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { CalibrationSettingsBase, CameraData } from '../types/calibration-settings'
import { defaultCalibrationSettingsBase } from '../defaults/calibration-settings'
import { ActionTypes, AppAction } from '../actions'
import { cameraPresets } from '../solver/camera-presets'

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
      // Update the preset id
      let newCameraData: CameraData = {
        ...state.cameraData,
        presetId: action.cameraPresetId,
        presetData: null
      }
      // Also store the preset data. Not accessed by fSpy internally
      // but may come in handy for importers etc
      if (action.cameraPresetId) {
        const cameraPreset = cameraPresets[action.cameraPresetId]
        if (cameraPreset) {
          newCameraData = {
            ...newCameraData,
            presetData: cameraPreset
          }
        }
      }
      return {
        ...state,
        cameraData: newCameraData
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
    case ActionTypes.LOAD_STATE:
      return action.savedState.calibrationSettingsBase
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultCalibrationSettingsBase
  }

  return state
}
