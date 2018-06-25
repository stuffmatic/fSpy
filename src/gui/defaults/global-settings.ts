import { CalibrationMode, GlobalSettings, Overlay3DGuide } from '../types/global-settings'

export const defaultGlobalSettings: GlobalSettings = {
  calibrationMode: CalibrationMode.TwoVanishingPoints,
  imageOpacity: 0.2,
  overlay3DGuide: Overlay3DGuide.None
}
