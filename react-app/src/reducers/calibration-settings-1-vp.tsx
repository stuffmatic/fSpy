import { CalibrationSettings1VP } from "../types/calibration-settings";
import { AppAction } from "../actions";
import { defaultCalibrationSettings1VP } from "../defaults/calibration-settings";

export function calibrationSettings1VP(state: CalibrationSettings1VP, action: AppAction): CalibrationSettings1VP {
  if (state === undefined) {
    return defaultCalibrationSettings1VP
  }
  return state
}