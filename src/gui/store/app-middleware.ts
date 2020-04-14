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

import { Middleware } from 'redux'
import { StoreState } from '../types/store-state'
import { actionTypesTriggeringRecalculation, recalculateCalibrationResult, actionTypesSettingNeedsSaveFlag, setProjectHasUnsavedChanges } from '../actions'
import store from './store'

// Middleware for requesting calibration result recalculation for
// action types matching a set of given types
export const appMiddleware: Middleware<{}, StoreState> = _ => next => action => {

  if (actionTypesTriggeringRecalculation.indexOf(action.type) >= 0) {
    store.dispatch<any>(recalculateCalibrationResult())
  }

  if (actionTypesSettingNeedsSaveFlag.indexOf(action.type) >= 0) {
    setTimeout(() => {
      store.dispatch(setProjectHasUnsavedChanges())
    })
  }

  return next(action)
}
