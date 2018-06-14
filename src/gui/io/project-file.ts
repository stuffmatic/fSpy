import { openSync, writeSync, closeSync, readFileSync, readSync } from 'fs'
import store from '../store/store'
import { StoreState } from '../types/store-state'
import SavedState from './saved-state'
import { AppAction, setProjectFilePath, loadSavedState, setImage } from '../actions'
import { Dispatch } from 'react-redux'
import { loadImage } from './util'

export default class ProjectFile {
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
      controlPointsState2VP: storeState.controlPointsState2VP
    }
  }

  static save(path: string, dispatch: Dispatch<AppAction>) {

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

  static load(path: string, dispatch: Dispatch<AppAction>, isExampleProject: boolean = false) {
    if (!this.isProjectFile(path)) {
      alert('Not a project file')
    } else {
      let headerSize = 16
      let buffer = readFileSync(path)
      let projectFileVersion = buffer.readUInt32LE(4)
      if (projectFileVersion != this.PROJECT_FILE_VERSION) {
        alert('Cannot load project file with version ' + projectFileVersion)
      } else {
        let stateStringSize = buffer.readUInt32LE(8)
        let stateStringBuffer = buffer.slice(headerSize, headerSize + stateStringSize)
        let stateString = stateStringBuffer.toString()
        let imageBufferSize = buffer.readUInt32LE(12)
        let imageBuffer: Buffer | null = null
        if (imageBufferSize > 0) {
          imageBuffer = buffer.slice(headerSize + stateStringSize)
        }

        if (imageBuffer) {
          loadImage(
            imageBuffer,
            (width: number, height: number, url: string) => {
              dispatch(setImage(url, imageBuffer!, width, height))
            },
            () => {
              alert('Failed to load image in project file')
            }
          )
        }

        let loadedState: SavedState = JSON.parse(stateString)
        dispatch(loadSavedState(loadedState))
        if (!isExampleProject) {
          dispatch(setProjectFilePath(path))
        }
      }
    }
  }

  static isProjectFile(path: string): boolean {
    let file = openSync(path, 'r')
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
