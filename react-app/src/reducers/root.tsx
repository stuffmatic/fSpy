import { combineReducers } from 'redux'
import { StoreState } from '../types/store-state';
import { controlPointsState } from './control-points'


const rootReducer = combineReducers<StoreState>({ controlPointsState })
export default rootReducer;