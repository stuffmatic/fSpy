import { CalibrationMode } from "../types/store-state";
import { AppAction, SET_CALIBRATION_MODE } from "../actions";

export function calibrationMode(state: CalibrationMode, action: AppAction): CalibrationMode {
  if (state === undefined) {
    return CalibrationMode.OneVanishingPoint
  }

  switch (action.type) {
    case SET_CALIBRATION_MODE:
      return action.calibrationMode;
  }

  return state;
}