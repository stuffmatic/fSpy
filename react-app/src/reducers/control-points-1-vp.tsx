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

  switch (action.type) {
    case ActionTypes.ADJUST_HORIZON:
      let updatedHorizon = { ...state.horizon }
      updatedHorizon[action.controlPointIndex] = action.position
      return {
        ...state,
        horizon: updatedHorizon
      }
    case ActionTypes.SET_ORIGIN:
      if (action.calibrationMode == CalibrationMode.OneVanishingPoint) {
        return {
          ...state,
          origin: action.position
        }
      }
      break
    case ActionTypes.SET_PRINCIPAL_POINT:
      if (action.calibrationMode == CalibrationMode.OneVanishingPoint) {
        return {
          ...state,
          principalPoint: action.position
        }
      }
      break
    case ActionTypes.ADJUST_VANISHING_LINE:
      if (action.calibrationMode == CalibrationMode.OneVanishingPoint) {
        let adjustedVanishingPoints:[VanishingPointControlState] = [
          {... state.vanishingPoints[0] }
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
