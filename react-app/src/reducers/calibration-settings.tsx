import { CalibrationSettings, CalibrationMode } from "../types/store-state";
import { AppAction, SET_CALIBRATION_MODE } from "../actions";

export function calibrationSettings(state: CalibrationSettings, action: AppAction): CalibrationSettings {
  if (state === undefined) {
    return {
      calibrationMode: CalibrationMode.TwoVanishingPoints
    }
  }

  switch (action.type) {
    case SET_CALIBRATION_MODE:
      return {
        ...state,
        calibrationMode: action.calibrationMode
      }
  }

  return state;
}