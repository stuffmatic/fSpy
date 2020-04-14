/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { GlobalSettings } from './global-settings'
import { ControlPointsState2VP, ControlPointsState1VP, ControlPointsStateBase } from './control-points-state'
import { CalibrationSettings2VP, CalibrationSettings1VP, CalibrationSettingsBase } from './calibration-settings'
import { ImageState } from './image-state'
import { UIState } from './ui-state'
import { SolverResult } from '../solver/solver-result'
import { ResultDisplaySettings } from './result-display-settings'

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
  resultDisplaySettings: ResultDisplaySettings
  uiState: UIState
}
