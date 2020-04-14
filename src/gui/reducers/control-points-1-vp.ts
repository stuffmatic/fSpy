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
import { ControlPointsState1VP } from '../types/control-points-state'
import { defaultControlPointsState1VP } from '../defaults/control-points-state'

export function controlPointsState1VP(state: ControlPointsState1VP | undefined, action: AppAction): ControlPointsState1VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState1VP
    }
  }

  switch (action.type) {
    case ActionTypes.ADJUST_HORIZON:
      let updatedHorizon = { ...state.horizon }
      updatedHorizon[action.controlPointIndex] = action.position
      return {
        ...state,
        horizon: updatedHorizon
      }
    case ActionTypes.LOAD_STATE:
      return action.savedState.controlPointsState1VP
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultControlPointsState1VP
  }

  return state
}
