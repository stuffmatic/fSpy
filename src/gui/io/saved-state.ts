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
