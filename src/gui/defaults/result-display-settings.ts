import { ResultDisplaySettings, OrientationFormat, PrincipalPointFormat, FieldOfViewFormat } from '../types/result-display-settings'

export const defaultResultDisplaySettings: ResultDisplaySettings = {
  orientationFormat: OrientationFormat.AxisAngleDegrees,
  principalPointFormat: PrincipalPointFormat.Absolute,
  fieldOfViewFormat: FieldOfViewFormat.Degrees,
  displayAbsoluteFocalLength: false
}
