import { createStore, applyMiddleware, AnyAction } from 'redux'
import rootReducer from '../reducers/root'
import { Store } from 'react-redux'
import { StoreState } from '../types/store-state'
import thunk from 'redux-thunk'
import { appMiddleware } from './app-middleware'

const store: Store<any> = createStore<StoreState, AnyAction, {}, {}>(
  rootReducer,
  applyMiddleware(appMiddleware, thunk)
)

export default store
