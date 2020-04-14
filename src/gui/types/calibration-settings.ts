import { CameraPreset } from '../solver/camera-presets'

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

export enum PrincipalPointMode1VP {
  Default = 'Default',
  Manual = 'Manual'
}

export enum PrincipalPointMode2VP {
  Default = 'Default',
  Manual = 'Manual',
  FromThirdVanishingPoint = 'FromThirdVanishingPoint'
}

export enum Axis {
  PositiveX = 'xPositive',
  NegativeX = 'xNegative',
  PositiveY = 'yPositive',
  NegativeY = 'yNegative',
  PositiveZ = 'zPositive',
  NegativeZ = 'zNegative'
}

export enum ReferenceDistanceUnit {
  None = 'No unit',
  Millimeters = 'Millimeters',
  Centimeters = 'Centimeters',
  Meters = 'Meters',
  Kilometers = 'Kilometers',
  Inches = 'Inches',
  Feet = 'Feet',
  Miles = 'Miles'
}

export interface CameraData {
  presetId: string | null
  presetData: CameraPreset | null
  customSensorWidth: number
  customSensorHeight: number
}

export interface CalibrationSettingsBase {
  referenceDistanceUnit: ReferenceDistanceUnit
  referenceDistance: number
  referenceDistanceAxis: Axis | null
  cameraData: CameraData
  firstVanishingPointAxis: Axis
  secondVanishingPointAxis: Axis
}

export interface CalibrationSettings1VP {
  principalPointMode: PrincipalPointMode1VP
  absoluteFocalLength: number
}

export interface CalibrationSettings2VP {
  principalPointMode: PrincipalPointMode2VP
  quadModeEnabled: boolean
}
