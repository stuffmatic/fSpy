import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP, ReferenceDistanceUnit, PrincipalPointMode1VP, Axis, PrincipalPointMode2VP, HorizonMode } from "../types/calibration-settings";

const defaultCalibrationSettingsBase: CalibrationSettingsBase = {
  referenceDistanceUnit: ReferenceDistanceUnit.Meters,
  referenceDistance: 10
}

export const defaultCalibrationSettings1VP: CalibrationSettings1VP = {
  ...defaultCalibrationSettingsBase,
  principalPointMode: PrincipalPointMode1VP.Default,
  upAxis: Axis.PositiveY,
  horizonMode: HorizonMode.Default
}

export const defaultCalibrationSettings2VP: CalibrationSettings2VP = {
  ...defaultCalibrationSettingsBase,
  principalPointMode: PrincipalPointMode2VP.Default,
  quadModeEnabled: false
}