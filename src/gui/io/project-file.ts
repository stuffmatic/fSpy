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

import { openSync, writeSync, closeSync, readFileSync, readSync } from 'fs'
import store from '../store/store'
import { StoreState } from '../types/store-state'
import SavedState from './saved-state'
import { AppAction, loadState, setProjectFilePath } from '../actions'
import { Dispatch } from 'redux'
import { loadImage, resourcePath } from './util'
import { remote } from 'electron'
import { defaultResultDisplaySettings } from '../defaults/result-display-settings'
import { cameraPresets } from '../solver/camera-presets'
import { ReferenceDistanceUnit } from '../types/calibration-settings'

export default class ProjectFile {
  static readonly EXAMPLE_PROJECT_FILENAME = 'example.fspy'
  static readonly PROJECT_FILE_EXTENSION = 'fspy'
  static readonly PROJECT_FILE_ID = 'fspy'
  static readonly PROJECT_FILE_VERSION = 1

  static get exampleProjectPath() {
    return resourcePath(this.EXAMPLE_PROJECT_FILENAME)
  }

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

  static save(path: string, dispatch: Dispatch<AppAction>) {

    if (!path.endsWith('.' + this.PROJECT_FILE_EXTENSION)) {
      path += '.' + this.PROJECT_FILE_EXTENSION
    }

    let storeState: StoreState = store.getState()

    let imageData = storeState.image.data
    let stateToSave = this.getStateToSave()

    let stateJsonString = JSON.stringify(stateToSave)
    let stateBuffer = new Buffer(stateJsonString)

    let headerBuffer = new Buffer(16)

    headerBuffer.writeUInt8(this.PROJECT_FILE_ID.charCodeAt(0), 0)
    headerBuffer.writeUInt8(this.PROJECT_FILE_ID.charCodeAt(1), 1)
    headerBuffer.writeUInt8(this.PROJECT_FILE_ID.charCodeAt(2), 2)
    headerBuffer.writeUInt8(this.PROJECT_FILE_ID.charCodeAt(3), 3)
    headerBuffer.writeUInt32LE(this.PROJECT_FILE_VERSION, 4)
    headerBuffer.writeUInt32LE(stateBuffer.length, 8)
    headerBuffer.writeUInt32LE(imageData ? imageData.length : 0, 12)

    let file = openSync(path, 'w')
    writeSync(file, headerBuffer)
    writeSync(file, stateBuffer)
    if (imageData) {
      writeSync(file, imageData)
    }
    closeSync(file)
    dispatch(setProjectFilePath(path))
  }

  static loadExample(dispatch: Dispatch<AppAction>) {
    this.load(this.exampleProjectPath, dispatch, true)
  }

  static load(path: string, dispatch: Dispatch<AppAction>, isExampleProject: boolean) {
    if (!this.isProjectFile(path)) {
      remote.dialog.showErrorBox(// TODO: proper modal
        'Failed to load project',
        'This does not appear to be a valid project file'
      )
    } else {
      let buffer = new Buffer(0)
      try {
        buffer = readFileSync(path)
      } catch {
        remote.dialog.showErrorBox(// TODO: proper modal
          'Failed to load image data',
          'Could not load the image data contained in the project file'
        )
        return
      }

      let headerSize = 16
      let projectFileVersion = buffer.readUInt32LE(4)
      if (projectFileVersion != this.PROJECT_FILE_VERSION) {
        remote.dialog.showErrorBox(// TODO: proper modal
          'Failed to load project',
          'Version ' + projectFileVersion + ' project files are not compatible with this version of fSpy.'
        )
      } else {
        let stateStringSize = buffer.readUInt32LE(8)
        let stateStringBuffer = buffer.slice(headerSize, headerSize + stateStringSize)
        let stateString = stateStringBuffer.toString()
        let imageBufferSize = buffer.readUInt32LE(12)
        let imageBuffer: Buffer | null = null
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
              remote.dialog.showErrorBox(
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

  static isProjectFile(path: string): boolean {
    let file = 0
    try {
      file = openSync(path, 'r')
    } catch {
      return false
    }

    let buffer = new Buffer(4)
    readSync(file, buffer, 0, 4, 0)
    closeSync(file)
    let fileId = [
      buffer.readUInt8(0),
      buffer.readUInt8(1),
      buffer.readUInt8(2),
      buffer.readUInt8(3)
    ]
    for (let i = 0; i < fileId.length; i++) {
      if (fileId[i] != this.PROJECT_FILE_ID.charCodeAt(i)) {
        return false
      }
    }

    return true
  }
}
