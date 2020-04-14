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

export enum CalibrationMode {
  OneVanishingPoint = 'OneVanishingPoint',
  TwoVanishingPoints = 'TwoVanishingPoints'
}

export enum Overlay3DGuide {
  None = 'None',
  Box = 'Box',
  XYGridFloor = 'XYGridFloor',
  YZGridFloor = 'YZGridFloor',
  ZXGridFloor = 'ZXGridFloor'
}

export interface GlobalSettings {
  calibrationMode: CalibrationMode
  overlay3DGuide: Overlay3DGuide
  imageOpacity: number
}
