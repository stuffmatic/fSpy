import { ActionTypes } from '../actions'
import { ControlPointsState2VP } from '../types/control-points-state'
import { defaultControlPointsState2VP } from '../defaults/control-points-state'
import { AnyAction } from 'redux'

export function controlPointsState2VP(state: ControlPointsState2VP | undefined, action: AnyAction): ControlPointsState2VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState2VP
    }
  }

  switch (action.type) {
    case ActionTypes.ADJUST_VANISHING_POINT_2VP:
      let secondVanishingPoint = { ...state.secondVanishingPoint }
      let thirdVanishingPoint = { ...state.secondVanishingPoint }

      let adjustedVanishingPoint = action.vanishingPointIndex == 1 ? secondVanishingPoint : thirdVanishingPoint
      let adjustedLineSegment = adjustedVanishingPoint.lineSegments[action.lineSegmentIndex]
      adjustedLineSegment[action.controlPointIndex] = action.position

      return {
        ...state,
        secondVanishingPoint: secondVanishingPoint,
        thirdVanishingPoint: thirdVanishingPoint
      }
  }

  return state
}
