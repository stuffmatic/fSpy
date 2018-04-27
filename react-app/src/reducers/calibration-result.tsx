
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationResult } from "../defaults/calibration-result";
import CalibrationResult from "../types/calibration-result";

export function calibrationResult(state: CalibrationResult | null, action: AppAction): CalibrationResult | null {
  if (state === undefined) {
    return defaultCalibrationResult
  }

  switch (action.type) {
    case ActionTypes.COMPUTE_CALIBRATION_RESULT:
      return {
        dummy: Math.random()
      }
  }

  return state
}