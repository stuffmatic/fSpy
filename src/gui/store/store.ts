import { createStore, applyMiddleware, AnyAction } from 'redux'
import rootReducer from '../reducers/root'
import { Store } from 'react-redux'
import { StoreState } from '../types/store-state'
import thunk from 'redux-thunk'
import { recalculationTriggerMiddleware } from './recalculation-trigger-middleware'

const store: Store<any> = createStore<StoreState, AnyAction, {}, {}>(
  rootReducer,
  applyMiddleware(recalculationTriggerMiddleware, thunk)
)

export default store
