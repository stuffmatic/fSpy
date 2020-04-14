/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { createStore, applyMiddleware, AnyAction, Store } from 'redux'
import rootReducer from '../reducers/root'
import { StoreState } from '../types/store-state'
import thunk from 'redux-thunk'
import { appMiddleware } from './app-middleware'

const store: Store<any> = createStore<StoreState, AnyAction, {}, {}>(
  rootReducer,
  applyMiddleware(appMiddleware, thunk)
)

export default store
