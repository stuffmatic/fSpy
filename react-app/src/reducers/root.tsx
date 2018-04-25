import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsState1VP, controlPointsState2VP } from './control-points'
import { calibrationMode } from './calibration-mode'

const rootReducer = combineReducers<StoreState>({
  calibrationMode,
  controlPointsState1VP,
  controlPointsState2VP
})
export default rootReducer;