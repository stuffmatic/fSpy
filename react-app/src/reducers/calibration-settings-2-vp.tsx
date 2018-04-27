import { CalibrationSettings2VP } from "../types/calibration-settings";
import { AppAction } from "../actions";
import { defaultCalibrationSettings2VP } from "../defaults/calibration-settings";

export function calibrationSettings2VP(state: CalibrationSettings2VP, action: AppAction): CalibrationSettings2VP {
  if (state === undefined) {
    return defaultCalibrationSettings2VP
  }
  return state
}