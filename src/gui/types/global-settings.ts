export enum CalibrationMode {
  OneVanishingPoint = 'OneVanishingPoint',
  TwoVanishingPoints = 'TwoVanishingPoints'
}

export enum Overlay3DGuide {
  None = 'None',
  Box = 'Box',
  XYGridFloor = 'XYGridFloor',
  YZGridFloor = 'YZGridFloor',
  ZXGridFloor = 'ZXGridFloor'
}

export interface GlobalSettings {
  calibrationMode: CalibrationMode
  overlay3DGuide: Overlay3DGuide
  imageOpacity: number
}
