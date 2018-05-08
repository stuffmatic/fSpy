import { GlobalSettings } from "./global-settings";
import { ControlPointsState2VP, ControlPointsState1VP } from "./control-points-state";
import { CalibrationSettings2VP, CalibrationSettings1VP } from "./calibration-settings";
import { ImageState } from "./image-state";
import CalibrationResult from "./calibration-result";
import { UIState } from "./ui-state";

export interface StoreState {
  globalSettings:GlobalSettings

  calibrationSettings1VP:CalibrationSettings1VP
  controlPointsState1VP:ControlPointsState1VP

  calibrationSettings2VP:CalibrationSettings2VP
  controlPointsState2VP:ControlPointsState2VP

  image:ImageState

  calibrationResult: CalibrationResult
  uiState:UIState
}