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
import { ControlPointsState2VP } from '../types/control-points-state'
import { defaultControlPointsState2VP } from '../defaults/control-points-state'

export function controlPointsState2VP(state: ControlPointsState2VP | undefined, action: AppAction): ControlPointsState2VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState2VP
    }
  }

  switch (action.type) {
    case ActionTypes.ADJUST_SECOND_VANISHING_POINT: {
      // TODO: proper deep copy
      let secondVanishingPoint = { ...state.secondVanishingPoint }
      let adjustedLineSegment = secondVanishingPoint.lineSegments[action.lineSegmentIndex]
      adjustedLineSegment[action.controlPointIndex] = action.position

      return {
        ...state,
        secondVanishingPoint: secondVanishingPoint
      }
    }
    case ActionTypes.ADJUST_THIRD_VANISHING_POINT: {
      // TODO: proper deep copy
      let thirdVanishingPoint = { ...state.thirdVanishingPoint }
      let adjustedLineSegment = thirdVanishingPoint.lineSegments[action.lineSegmentIndex]
      adjustedLineSegment[action.controlPointIndex] = action.position

      return {
        ...state,
        thirdVanishingPoint: thirdVanishingPoint
      }
    }
    case ActionTypes.LOAD_STATE:
      return action.savedState.controlPointsState2VP
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultControlPointsState2VP
  }

  return state
}
