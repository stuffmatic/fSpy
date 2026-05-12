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

import store from '../store/store'
import { StoreState } from '../types/store-state'
import SavedState from './saved-state'
import { AppAction, loadState, setProjectFilePath } from '../actions'
import { Dispatch } from 'redux'
import { loadImage } from './util'
import '../types/electron-api'
import { defaultResultDisplaySettings } from '../defaults/result-display-settings'
import { cameraPresets } from '../solver/camera-presets'
import { ReferenceDistanceUnit } from '../types/calibration-settings'

export default class ProjectFile {
  static readonly EXAMPLE_PROJECT_FILENAME = 'example.fspy'
  static readonly PROJECT_FILE_EXTENSION = 'fspy'
  static readonly PROJECT_FILE_ID = 'fspy'
  static readonly PROJECT_FILE_VERSION = 1

  static getStateToSave(): SavedState {
    let storeState: StoreState = store.getState()
    return {
      globalSettings: storeState.globalSettings,
      calibrationSettingsBase: storeState.calibrationSettingsBase,
      calibrationSettings1VP: storeState.calibrationSettings1VP,
      calibrationSettings2VP: storeState.calibrationSettings2VP,
      controlPointsStateBase: storeState.controlPointsStateBase,
      controlPointsState1VP: storeState.controlPointsState1VP,
      controlPointsState2VP: storeState.controlPointsState2VP,
      cameraParameters: storeState.solverResult.cameraParameters,
      resultDisplaySettings: storeState.resultDisplaySettings
    }
  }

  static async save(path: string, dispatch: Dispatch<AppAction>) {

    if (!path.endsWith('.' + this.PROJECT_FILE_EXTENSION)) {
      path += '.' + this.PROJECT_FILE_EXTENSION
    }

    let storeState: StoreState = store.getState()

    let imageData = storeState.image.data
    let stateToSave = this.getStateToSave()

    let stateJsonString = JSON.stringify(stateToSave)
    let stateBytes = new TextEncoder().encode(stateJsonString)

    let headerBytes = new Uint8Array(16)
    let headerView = new DataView(headerBytes.buffer)

    headerBytes[0] = this.PROJECT_FILE_ID.charCodeAt(0)
    headerBytes[1] = this.PROJECT_FILE_ID.charCodeAt(1)
    headerBytes[2] = this.PROJECT_FILE_ID.charCodeAt(2)
    headerBytes[3] = this.PROJECT_FILE_ID.charCodeAt(3)
    headerView.setUint32(4, this.PROJECT_FILE_VERSION, true)
    headerView.setUint32(8, stateBytes.length, true)
    headerView.setUint32(12, imageData ? imageData.length : 0, true)

    let totalSize = headerBytes.length + stateBytes.length + (imageData ? imageData.length : 0)
    let fileData = new Uint8Array(totalSize)
    fileData.set(headerBytes, 0)
    fileData.set(stateBytes, headerBytes.length)
    if (imageData) {
      fileData.set(imageData, headerBytes.length + stateBytes.length)
    }

    await window.electronAPI.writeFile(path, fileData)
    dispatch(setProjectFilePath(path))
  }

  static async loadExample(dispatch: Dispatch<AppAction>) {
    let examplePath = await window.electronAPI.getResourcePath(this.EXAMPLE_PROJECT_FILENAME)
    await this.load(examplePath, dispatch, true)
  }

  static async load(path: string, dispatch: Dispatch<AppAction>, isExampleProject: boolean) {
    let valid = await window.electronAPI.isProjectFile(path)
    if (!valid) {
      window.electronAPI.showErrorBox(
        'Failed to load project',
        'This does not appear to be a valid project file'
      )
    } else {
      let buffer: Uint8Array
      try {
        buffer = await window.electronAPI.readFile(path)
      } catch {
        window.electronAPI.showErrorBox(
          'Failed to load image data',
          'Could not load the image data contained in the project file'
        )
        return
      }

      let view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)
      let headerSize = 16
      let projectFileVersion = view.getUint32(4, true)
      if (projectFileVersion != this.PROJECT_FILE_VERSION) {
        window.electronAPI.showErrorBox(
          'Failed to load project',
          'Version ' + projectFileVersion + ' project files are not compatible with this version of fSpy.'
        )
      } else {
        let stateStringSize = view.getUint32(8, true)
        let stateStringBytes = buffer.slice(headerSize, headerSize + stateStringSize)
        let stateString = new TextDecoder().decode(stateStringBytes)
        let imageBufferSize = view.getUint32(12, true)
        let imageBuffer: Uint8Array | null = null
        if (imageBufferSize > 0) {
          imageBuffer = buffer.slice(headerSize + stateStringSize)
        }

        let loadedState: SavedState = JSON.parse(stateString)
        if (loadedState.cameraParameters === undefined) {
          loadedState.cameraParameters = null
        }
        if (loadedState.resultDisplaySettings === undefined) {
          loadedState.resultDisplaySettings = defaultResultDisplaySettings
        }

        // Earlier versions had yards as a reference distance unit. Switch to feet
        // if that's the case
        const distanceUnitString = loadedState.calibrationSettingsBase.referenceDistanceUnit.toString()
        if (distanceUnitString == 'Yards') {
          loadedState.calibrationSettingsBase.referenceDistanceUnit = ReferenceDistanceUnit.Feet
          loadedState.calibrationSettingsBase.referenceDistance *= 3.0 // 3 feet per yard
        }

        // Make sure the stored camera preset still exists. If not, fall back to
        // custom camera preset
        const cameraPresetId = loadedState.calibrationSettingsBase.cameraData.presetId
        if (cameraPresetId) {
          if (cameraPresets[cameraPresetId] === undefined) {
            loadedState.calibrationSettingsBase.cameraData.presetId = null
          }
        }

        // Fix old files not storing camera preset data
        if (loadedState.calibrationSettingsBase.cameraData.presetData === undefined) {
          loadedState.calibrationSettingsBase.cameraData.presetData = null
          const presetId = loadedState.calibrationSettingsBase.cameraData.presetId
          if (presetId) {
            const preset = cameraPresets[presetId]
            if (preset) {
              loadedState.calibrationSettingsBase.cameraData.presetData = preset
            }
          }
        }

        if (imageBuffer) {
          // There is image data in the project file. Load the image and then load
          // the state
          loadImage(
            imageBuffer,
            (width: number, height: number, url: string) => {
              dispatch(
                loadState(
                  loadedState,
                  {
                    width: width,
                    height: height,
                    data: imageBuffer,
                    url: url
                  },
                  path,
                  isExampleProject
                )
              )
            },
            () => {
              window.electronAPI.showErrorBox(
                'Failed to load image data',
                'Could not load the image data contained in the project file'
              )
            }
          )
        } else {
          // There is no image data in the project file. Load the state
          // and blank image data
          dispatch(
            loadState(
              loadedState,
              {
                width: null,
                height: null,
                data: null,
                url: null
              },
              path,
              isExampleProject
            )
          )
        }
      }
    }
  }

  static async isProjectFile(path: string): Promise<boolean> {
    return window.electronAPI.isProjectFile(path)
  }
}
