import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsState1VP } from './control-points-1-vp'
import { controlPointsState2VP } from './control-points-2-vp'
import { globalSettings } from './global-settings'

const rootReducer = combineReducers<StoreState>({
  globalSettings,
  controlPointsState1VP,
  controlPointsState2VP
})
export default rootReducer;