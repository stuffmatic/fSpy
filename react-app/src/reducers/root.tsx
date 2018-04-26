import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsStates } from './control-points'
import { calibrationSettings } from './calibration-settings'

const rootReducer = combineReducers<StoreState>({
  calibrationSettings,
  controlPointsStates
})
export default rootReducer;