import { AppAction, ActionTypes } from '../actions';
import { ControlPointsState2VP, CalibrationMode, VanishingPointControlState } from '../types/store-state';
import { defaultControlPointsState2VP } from '../types/defaults'

export function controlPointsState2VP(state: ControlPointsState2VP, action: AppAction): ControlPointsState2VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState2VP
    }
  }

  switch (action.type) {
    case ActionTypes.SET_ORIGIN:
      if (action.calibrationMode == CalibrationMode.TwoVanishingPoints) {
        return {
          ...state,
          origin: action.position
        }
      }
      break
    case ActionTypes.SET_PRINCIPAL_POINT:
      if (action.calibrationMode == CalibrationMode.TwoVanishingPoints) {
        return {
          ...state,
          principalPoint: action.position
        }
      }
      break
    case ActionTypes.ADJUST_VANISHING_LINE:
      if (action.calibrationMode == CalibrationMode.TwoVanishingPoints) {
        let adjustedVanishingPoints: [VanishingPointControlState, VanishingPointControlState, VanishingPointControlState] = [
          { ...state.vanishingPoints[0] },
          { ...state.vanishingPoints[1] },
          { ...state.vanishingPoints[2] }
        ]
        let adjustedVanishingPoint = adjustedVanishingPoints[action.vanishingPointIndex]
        let adjustedVanishingLine = adjustedVanishingPoint.vanishingLines[action.vanishingLineIndex]
        adjustedVanishingLine[action.controlPointIndex] = action.position

        return {
          ...state,
          vanishingPoints: adjustedVanishingPoints
        }
      }
      break
  }

  return state;
}
