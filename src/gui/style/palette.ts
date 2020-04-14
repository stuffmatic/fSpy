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

import { Axis } from '../types/calibration-settings'

export class Palette {
  // Color constants
  static readonly red = '#EC4E37'
  static readonly green = '#70BF41'
  static readonly blue = '#359DF9'
  static readonly orange = '#F39019'
  static readonly yellow = '#F3CA05'
  static readonly white = '#FFFFFF'
  static readonly lightGray = 'Menu'
  static readonly gray = '#e1e1e1'
  static readonly black = 'WindowText'
  static readonly imagePanelBackgroundColor = '#252B2E'
  static readonly disabledTextColor = '#909090'

  // Color aliases
  static readonly xAxisColor = Palette.red
  static readonly yAxisColor = Palette.green
  static readonly zAxisColor = Palette.blue
  static readonly originColor = Palette.white
  static readonly referenceDistanceControlColor = Palette.yellow
  static readonly principalPointColor = Palette.orange

  static colorForAxis(axis: Axis): string {
    switch (axis) {
      case Axis.NegativeX:
        return this.red
      case Axis.PositiveX:
        return this.red
      case Axis.NegativeY:
        return this.green
      case Axis.PositiveY:
        return this.green
      case Axis.NegativeZ:
        return this.blue
      case Axis.PositiveZ:
        return this.blue
    }
  }
}
