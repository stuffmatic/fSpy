import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsState1VP } from './control-points-1-vp'
import { controlPointsState2VP } from './control-points-2-vp'
import { calibrationSettings } from './calibration-settings'

const rootReducer = combineReducers<StoreState>({
  calibrationSettings,
  controlPointsState1VP,
  controlPointsState2VP
})
export default rootReducer;