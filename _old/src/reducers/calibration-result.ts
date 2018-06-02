
import { AppAction, ActionTypes } from "../actions";
import { defaultCalibrationResult } from "../defaults/calibration-result";
import CalibrationResult from "../types/calibration-result";

export function calibrationResult(state: CalibrationResult, action: AppAction): CalibrationResult {
  if (state === undefined) {
    return defaultCalibrationResult
  }

  switch (action.type) {
    case ActionTypes.SET_CALIBRATION_RESULT:
      return action.result
  }

  return state
}