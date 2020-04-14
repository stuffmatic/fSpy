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

import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP, ReferenceDistanceUnit, PrincipalPointMode1VP, Axis, PrincipalPointMode2VP } from '../types/calibration-settings'

export const defaultCalibrationSettingsBase: CalibrationSettingsBase = {
  referenceDistanceAxis: null,
  referenceDistance: 4,
  referenceDistanceUnit: ReferenceDistanceUnit.Meters,
  cameraData: {
    presetId: null,
    presetData: null,
    customSensorWidth: 36,
    customSensorHeight: 24
  },
  firstVanishingPointAxis: Axis.PositiveX,
  secondVanishingPointAxis: Axis.PositiveY
}

export const defaultCalibrationSettings1VP: CalibrationSettings1VP = {
  principalPointMode: PrincipalPointMode1VP.Default,
  absoluteFocalLength: 24
}

export const defaultCalibrationSettings2VP: CalibrationSettings2VP = {
  principalPointMode: PrincipalPointMode2VP.Default,
  quadModeEnabled: false
}
