import { GlobalSettings } from '../types/global-settings'
import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings'
import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state'
import { CameraParameters } from '../solver/solver-result'
import { ResultDisplaySettings } from '../types/result-display-settings'

export default interface SavedState {
  globalSettings: GlobalSettings

  calibrationSettingsBase: CalibrationSettingsBase
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP

  controlPointsStateBase: ControlPointsStateBase
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP

  cameraParameters: CameraParameters | null
  resultDisplaySettings: ResultDisplaySettings
}
