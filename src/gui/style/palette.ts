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
  static readonly gray = '#D1D3D5'
  static readonly black = 'WindowText'

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
