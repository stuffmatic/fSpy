import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP, ReferenceDistanceUnit, PrincipalPointMode1VP, Axis, PrincipalPointMode2VP, HorizonMode } from "../types/calibration-settings";

const defaultCalibrationSettingsBase: CalibrationSettingsBase = {
  referenceDistanceAxis: Axis.PositiveX,
  referenceDistance: 10,
  referenceDistanceUnit: ReferenceDistanceUnit.Meters
}

export const defaultCalibrationSettings1VP: CalibrationSettings1VP = {
  ...defaultCalibrationSettingsBase,
  principalPointMode: PrincipalPointMode1VP.Default,
  upAxis: Axis.PositiveY,
  horizonMode: HorizonMode.Default,
  vanishingPointAxis: Axis.PositiveX
}

export const defaultCalibrationSettings2VP: CalibrationSettings2VP = {
  ...defaultCalibrationSettingsBase,
  principalPointMode: PrincipalPointMode2VP.Default,
  quadModeEnabled: false,
  vanishingPointAxes: [Axis.PositiveX, Axis.PositiveY]
}