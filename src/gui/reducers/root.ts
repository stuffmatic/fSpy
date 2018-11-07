import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state'
import { calibrationSettingsBase } from './calibration-settings-base'
import { calibrationSettings1VP } from './calibration-settings-1-vp'
import { calibrationSettings2VP } from './calibration-settings-2-vp'
import { controlPointsStateBase } from './control-points-base'
import { controlPointsState1VP } from './control-points-1-vp'
import { controlPointsState2VP } from './control-points-2-vp'
import { resultDisplaySettings } from './result-display-settings'
import { solverResult } from './solver-result'
import { globalSettings } from './global-settings'
import { imageState } from './image-state'
import { uiState } from './ui-state'

const rootReducer = combineReducers<StoreState>({
  globalSettings,
  calibrationSettingsBase,
  calibrationSettings1VP,
  calibrationSettings2VP,
  controlPointsStateBase,
  controlPointsState1VP,
  controlPointsState2VP,
  solverResult,
  image: imageState,
  resultDisplaySettings,
  uiState
})

export default rootReducer
