import { writeFileSync, readFileSync } from 'fs'
import store from '../store/store'
import { StoreState } from '../types/store-state'
import SavedState from './saved-state'
import { loadSavedState } from '../actions'

export default class ProjectFile {
  static readonly PROJECT_FILE_VERSION = 1

  static save(path: string) {

    let storeState: StoreState = store.getState()

    let stateToSave: SavedState = {
      projectFileVersion: this.PROJECT_FILE_VERSION,
      globalSettings: storeState.globalSettings,
      calibrationSettingsBase: storeState.calibrationSettingsBase,
      calibrationSettings1VP: storeState.calibrationSettings1VP,
      calibrationSettings2VP: storeState.calibrationSettings2VP,
      controlPointsStateBase: storeState.controlPointsStateBase,
      controlPointsState1VP: storeState.controlPointsState1VP,
      controlPointsState2VP: storeState.controlPointsState2VP
    }

    writeFileSync(path, JSON.stringify(stateToSave, null, 2))
    console.log('TODO Save project file to ' + path)
  }

  static load(path: string) {
    let loadedState: SavedState = JSON.parse(readFileSync(path, 'utf8'))
    if (loadedState.projectFileVersion !== this.PROJECT_FILE_VERSION) {
      alert('Cannot load project file with version ' + loadedState.projectFileVersion)
    } else {
      console.log('Loaded state')
      console.log(loadedState)
      store.dispatch(loadSavedState(loadedState))
    }
  }
}
