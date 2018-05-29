import { Axis } from "./calibration-settings";

export enum CalibrationMode {
  OneVanishingPoint = "OneVanishingPoint",
  TwoVanishingPoints = "TwoVanishingPoints"
}

export interface GlobalSettings {
  calibrationMode:CalibrationMode
  gridFloorNormal:Axis | null
  imageOpacity:number
}