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

import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/root'
import { thunk } from 'redux-thunk'
import { appMiddleware } from './app-middleware'

const store = createStore(
  rootReducer,
  applyMiddleware(appMiddleware, thunk)
)

export default store
