import { ControlPointsStateBase } from '../types/control-points-state'
import { defaultControlPointsStateBase } from '../defaults/control-points-state'
import { ActionTypes, AppAction } from '../actions'
import Constants from '../constants'

export function controlPointsStateBase(state: ControlPointsStateBase | undefined, action: AppAction): ControlPointsStateBase {
  if (state === undefined) {
    return {
      ...defaultControlPointsStateBase
    }
  }

  switch (action.type) {
    case ActionTypes.SET_ORIGIN:
      if (Constants.referenceDistanceAnchorEnabled) {
        return {
          ...state,
          origin: action.position
        }
      } else {
        return {
          ...state,
          origin: action.position,
          referenceDistanceAnchor: action.position
        }
      }

    case ActionTypes.SET_PRINCIPAL_POINT:
      return {
        ...state,
        principalPoint: action.position
      }
    case ActionTypes.SET_REFERENCE_DISTANCE_ANCHOR:
      return {
        ...state,
        referenceDistanceAnchor: action.position
      }
    case ActionTypes.ADJUST_REFERENCE_DISTANCE_HANDLE:
      let adjustedOffsets = [...state.referenceDistanceHandleOffsets]
      adjustedOffsets[action.handleIndex] = action.position
      return {
        ...state,
        referenceDistanceHandleOffsets: [adjustedOffsets[0], adjustedOffsets[1]]
      }
    case ActionTypes.ADJUST_FIRST_VANISHING_POINT:
      let adjustedVanishingPoint = { ...state.firstVanishingPoint }
      let adjustedLineSegment = adjustedVanishingPoint.lineSegments[action.lineSegmentIndex]
      adjustedLineSegment[action.controlPointIndex] = action.position

      return {
        ...state,
        firstVanishingPoint: adjustedVanishingPoint
      }
    case ActionTypes.LOAD_STATE:
      return action.savedState.controlPointsStateBase
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultControlPointsStateBase
  }

  return state
}
