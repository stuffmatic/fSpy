import { GlobalSettings } from './global-settings'
import { ControlPointsState2VP, ControlPointsState1VP, ControlPointsStateBase } from './control-points-state'
import { CalibrationSettings2VP, CalibrationSettings1VP, CalibrationSettingsBase } from './calibration-settings'
import { ImageState } from './image-state'
import { UIState } from './ui-state'
import { SolverResult } from '../solver/solver-result'

export interface StoreState {
  globalSettings: GlobalSettings

  calibrationSettingsBase: CalibrationSettingsBase
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP

  controlPointsStateBase: ControlPointsStateBase
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP

  image: ImageState

  solverResult: SolverResult
  uiState: UIState
}
