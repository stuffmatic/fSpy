import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP, ReferenceDistanceUnit, PrincipalPointMode1VP, Axis, PrincipalPointMode2VP, HorizonMode } from '../types/calibration-settings'

export const defaultCalibrationSettingsBase: CalibrationSettingsBase = {
  referenceDistanceAxis: Axis.PositiveZ,
  referenceDistance: 4,
  referenceDistanceUnit: ReferenceDistanceUnit.Meters,
  cameraData: {
    presetId: null,
    customSensorWidth: 20,
    customSensorHeight: 10
  }
}

export const defaultCalibrationSettings1VP: CalibrationSettings1VP = {
  principalPointMode: PrincipalPointMode1VP.Default,
  upAxis: Axis.PositiveY,
  horizonMode: HorizonMode.Manual,
  vanishingPointAxis: Axis.PositiveX,
  absoluteFocalLength: 50
}

export const defaultCalibrationSettings2VP: CalibrationSettings2VP = {
  principalPointMode: PrincipalPointMode2VP.Default,
  quadModeEnabled: false,
  vanishingPointAxes: [Axis.PositiveX, Axis.PositiveY]
}
