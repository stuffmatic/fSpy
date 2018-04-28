
import { AppAction } from "../actions";
import { defaultCalibrationResult } from "../defaults/calibration-result";
import CalibrationResult from "../types/calibration-result";

export function calibrationResult(state: CalibrationResult, action: AppAction): CalibrationResult {
  if (state === undefined) {
    return defaultCalibrationResult
  }

  return state
}