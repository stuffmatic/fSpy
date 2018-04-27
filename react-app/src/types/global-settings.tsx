export enum CalibrationMode {
  OneVanishingPoint = "OneVanishingPoint",
  TwoVanishingPoints = "TwoVanishingPoints"
}

export interface GlobalSettings {
  calibrationMode:CalibrationMode
  imageOpacity:number
}