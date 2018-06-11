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
  }

  return state
}
