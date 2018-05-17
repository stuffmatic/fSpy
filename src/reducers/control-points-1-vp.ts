import { AppAction, ActionTypes } from '../actions';
import { ControlPointsState1VP, VanishingPointControlState } from '../types/control-points-state';
import { CalibrationMode } from '../types/global-settings';
import { defaultControlPointsState1VP } from '../defaults/control-points-state';

export function controlPointsState1VP(state: ControlPointsState1VP, action: AppAction): ControlPointsState1VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState1VP
    }
  }

  //Early exit if the action is associated with the wrong calibration mode
  if ((action as any).calibrationMode == CalibrationMode.TwoVanishingPoints) {
    return state
  }

  switch (action.type) {
    case ActionTypes.ADJUST_HORIZON:
      let updatedHorizon = { ...state.horizon }
      updatedHorizon[action.controlPointIndex] = action.position
      return {
        ...state,
        horizon: updatedHorizon
      }
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
      let adjustedVanishingPoints: [VanishingPointControlState] = [
        { ...state.vanishingPoints[0] }
      ]
      let adjustedVanishingPoint = adjustedVanishingPoints[action.lineSegmentIndex]
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
