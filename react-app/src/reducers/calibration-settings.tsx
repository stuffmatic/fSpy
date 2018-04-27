import { CalibrationSettings, CalibrationMode } from "../types/store-state";
import { AppAction, ActionTypes } from "../actions";

export function calibrationSettings(state: CalibrationSettings, action: AppAction): CalibrationSettings {
  if (state === undefined) {
    return {
      calibrationMode: CalibrationMode.TwoVanishingPoints
    }
  }

  switch (action.type) {
    case ActionTypes.SET_CALIBRATION_MODE:
      return {
        ...state,
        calibrationMode: action.calibrationMode
      }
  }

  return state;
}