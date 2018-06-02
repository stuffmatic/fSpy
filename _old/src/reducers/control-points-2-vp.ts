import { AppAction, ActionTypes } from '../actions';
import { ControlPointsState2VP, VanishingPointControlState } from '../types/control-points-state';
import { CalibrationMode } from '../types/global-settings';
import { defaultControlPointsState2VP } from '../defaults/control-points-state';

export function controlPointsState2VP(state: ControlPointsState2VP, action: AppAction): ControlPointsState2VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState2VP
    }
  }

  //Early exit if the action is associated with the wrong calibration mode
  if ((action as any).calibrationMode == CalibrationMode.OneVanishingPoint) {
    return state
  }

  switch (action.type) {
    case ActionTypes.SET_ORIGIN:
      return {
        ...state,
        origin: action.position
      }
    case ActionTypes.SET_PRINCIPAL_POINT:
      return {
        ...state,
        principalPoint: action.position
      }
    case ActionTypes.ADJUST_VANISHING_POINT:
      let adjustedVanishingPoints: [VanishingPointControlState, VanishingPointControlState, VanishingPointControlState] = [
        { ...state.vanishingPoints[0] },
        { ...state.vanishingPoints[1] },
        { ...state.vanishingPoints[2] }
      ]
      let adjustedVanishingPoint = adjustedVanishingPoints[action.vanishingPointIndex]
      let adjustedLineSegment = adjustedVanishingPoint.lineSegments[action.lineSegmentIndex]
      adjustedLineSegment[action.controlPointIndex] = action.position

      return {
        ...state,
        vanishingPoints: adjustedVanishingPoints
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
  }

  return state;
}
