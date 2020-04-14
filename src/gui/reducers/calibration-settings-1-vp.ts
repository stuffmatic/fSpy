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

import { CalibrationSettings1VP } from '../types/calibration-settings'
import { ActionTypes, AppAction } from '../actions'
import { defaultCalibrationSettings1VP } from '../defaults/calibration-settings'

export function calibrationSettings1VP(state: CalibrationSettings1VP | undefined, action: AppAction): CalibrationSettings1VP {
  if (state === undefined) {
    return defaultCalibrationSettings1VP
  }

  switch (action.type) {
    case ActionTypes.SET_PRINCIPAL_POINT_MODE_1VP:
      return {
        ...state,
        principalPointMode: action.principalPointMode
      }
    case ActionTypes.SET_ABSOLUTE_FOCAL_LENGTH_1VP:
      return {
        ...state,
        absoluteFocalLength: action.absoluteFocalLength
      }
    case ActionTypes.LOAD_STATE:
      return action.savedState.calibrationSettings1VP
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultCalibrationSettings1VP
  }

  return state
}
