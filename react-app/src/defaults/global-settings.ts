import { CalibrationMode, GlobalSettings } from "../types/global-settings";

export const defaultGlobalSettings:GlobalSettings = {
  calibrationMode: CalibrationMode.TwoVanishingPoints,
  imageOpacity: 0.2,
  notes: "",
  gridFloorNormal: null
}
