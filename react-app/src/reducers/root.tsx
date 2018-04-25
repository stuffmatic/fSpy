import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsStates } from './control-points'
import { calibrationMode } from './calibration-mode'

const rootReducer = combineReducers<StoreState>({
  calibrationMode,
  controlPointsStates
})
export default rootReducer;