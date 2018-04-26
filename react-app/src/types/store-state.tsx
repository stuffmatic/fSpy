
export interface Point2D {
  x:number
  y:number
}

/**
 * The state of a single control point
 */
export interface ControlPointState {
  /** Relative image coordinates [0, 1] */
  x:number
  /** Relative image coordinates [0, 1] */
  y:number
}

export interface VanishingPointControlState {
  vanishingLine1Start: Point2D
  vanishingLine1End: Point2D
  vanishingLine2Start: Point2D
  vanishingLine2End: Point2D
}

export interface ControlPointsStateBase {
  /*
  referenceDistance
  referenceDistanceUnit
  origin
  vp1
  */
  principalPoint:ControlPointState
  origin:ControlPointState
  vanishingPointControl1:VanishingPointControlState
}

export interface ControlPointsState1VP extends ControlPointsStateBase {
  /* horizon */
  horizonStart:ControlPointState
  horizonEnd:ControlPointState
}

export interface ControlPointsState2VP extends ControlPointsStateBase {
  /*  referenceDistanceVpIndex */
  /* vpCouplingMode */
  vanishingPointControl2:VanishingPointControlState
  vanishingPointControl3:VanishingPointControlState
}

export enum CalibrationMode {
  OneVanishingPoint = "OneVanishingPoint",
  TwoVanishingPoints = "TwoVanishingPoints"
}

export interface CalibrationSettings {
  calibrationMode:CalibrationMode
}

export interface ControlPointsStates {
  controlPointsState1VP:ControlPointsState1VP
  controlPointsState2VP:ControlPointsState2VP
}

export interface StoreState {
  calibrationSettings:CalibrationSettings
  controlPointsStates: ControlPointsStates
}