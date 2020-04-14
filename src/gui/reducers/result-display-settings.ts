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

import { ActionTypes, AppAction } from '../actions'
import { ResultDisplaySettings } from '../types/result-display-settings'
import { defaultResultDisplaySettings } from '../defaults/result-display-settings'

export function resultDisplaySettings(state: ResultDisplaySettings | undefined, action: AppAction): ResultDisplaySettings {
  if (state === undefined) {
    return defaultResultDisplaySettings
  }

  switch (action.type) {
    case ActionTypes.SET_FOV_DISPLAY_FORMAT:
      return {
        ...state,
        fieldOfViewFormat: action.displayFormat
      }
    case ActionTypes.SET_ORIENTATION_DISPLAY_FORMAT:
      return {
        ...state,
        orientationFormat: action.displayFormat
      }
    case ActionTypes.SET_PRINCIPAL_POINT_DISPLAY_FORMAT:
      return {
        ...state,
        principalPointFormat: action.displayFormat
      }
    case ActionTypes.SET_DISPLAY_ABSOLUTE_FOCAL_LENGTH:
      return {
        ...state,
        displayAbsoluteFocalLength: action.displayAbsoluteFocalLength
      }
    case ActionTypes.LOAD_STATE:
      return {
        ...state,
        ...action.savedState.resultDisplaySettings
      }
    case ActionTypes.LOAD_DEFAULT_STATE:
      return {
        ...defaultResultDisplaySettings
      }
  }

  return state
}
