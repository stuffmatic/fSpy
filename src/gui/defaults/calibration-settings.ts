import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP, ReferenceDistanceUnit, PrincipalPointMode1VP, Axis, PrincipalPointMode2VP } from '../types/calibration-settings'

export const defaultCalibrationSettingsBase: CalibrationSettingsBase = {
  referenceDistanceAxis: null,
  referenceDistance: 4,
  referenceDistanceUnit: ReferenceDistanceUnit.Meters,
  cameraData: {
    presetId: null,
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
