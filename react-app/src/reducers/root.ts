import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { calibrationSettings1VP } from './calibration-settings-1-vp'
import { controlPointsState1VP } from './control-points-1-vp'
import { calibrationSettings2VP } from './calibration-settings-2-vp'
import { controlPointsState2VP } from './control-points-2-vp'
import { calibrationResult } from './calibration-result'
import { globalSettings } from './global-settings'
import { imageState } from './image-state';
import { uiState } from './ui-state';

const rootReducer = combineReducers<StoreState>({
  globalSettings,
  calibrationSettings1VP,
  controlPointsState1VP,
  calibrationSettings2VP,
  controlPointsState2VP,
  calibrationResult: calibrationResult,
  image: imageState,
  uiState: uiState
})
export default rootReducer;