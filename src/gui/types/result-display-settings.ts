export enum FieldOfViewFormat {
  Degrees = 'Degrees',
  Radians = 'Radians'
}

export enum OrientationFormat {
  AxisAngleDegrees = 'AxisAngleDegrees',
  AxisAngleRadians = 'AxisAngleRadians',
  Quaterion = 'Quaterion'
}

export enum PrincipalPointFormat {
  Relative = 'Relative',
  Absolute = 'Absolute'
}

export interface ResultDisplaySettings {
  fieldOfViewFormat: FieldOfViewFormat
  orientationFormat: OrientationFormat
  principalPointFormat: PrincipalPointFormat
}
