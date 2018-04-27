export enum PrincipalPointMode1VP {
  Default = "Default",
  Manual = "Manual"
}

export enum PrincipalPointMode2VP {
  Default = "Default",
  Manual = "Manual",
  FromThirdVanishingPoint = "FromThirdVanishingPoint"
}

export enum Axis {
  PositiveX = "PositiveX",
  NegativeX = "NegativeX",
  PositiveY = "PositiveY",
  NegativeY = "NegativeY",
  PositiveZ = "PositiveZ",
  NegativeZ = "NegativeZ",
}

export enum ReferenceDistanceUnit {
  Meters = "Meters",
  Yards = "Yards"
}

export interface CalibrationSettingsBase {
  referenceDistanceUnit:ReferenceDistanceUnit
  referenceDistance:number
  referenceDistanceVanishingPointIndex?:number
}

export interface CalibrationSettings1VP extends CalibrationSettingsBase {
  principalPointMode:PrincipalPointMode1VP
  upAxis:Axis
}

export interface CalibrationSettings2VP extends CalibrationSettingsBase {
  principalPointMode:PrincipalPointMode2VP
  quadModeEnabled:boolean
}