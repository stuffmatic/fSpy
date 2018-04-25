/*
interface VanshingPointControlState {
  controlPoint1:ControlPointsState
  controlPoint2:ControlPointsState
  controlPoint3:ControlPointsState
  controlPoint4:ControlPointsState
  controlPoint4:ControlPointsState
  isHidden
}
*/
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

export interface ControlPointsStateBase {
  /*
  referenceDistance
  referenceDistanceUnit
  origin
  vp1
  */
  principalPoint:ControlPointState
  origin:ControlPointState
}

export interface ControlPointsState1VP extends ControlPointsStateBase {
  /* horizon */
  horizonStart:ControlPointState
  horizonEnd:ControlPointState
}

export interface ControlPointsState2VP extends ControlPointsStateBase {
  /*  referenceDistanceVpIndex */
  /* vp2 */
  /* vp3 */
  /* vpCouplingMode */
}

export enum CalibrationMode {
  OneVanishingPoint = "OneVanishingPoint",
  TwoVanishingPoints = "TwoVanishingPoints"
}

export interface ControlPointsStates {
  controlPointsState1VP:ControlPointsState1VP
  controlPointsState2VP:ControlPointsState2VP
}

export interface StoreState {
  calibrationMode:CalibrationMode
  controlPointsStates: ControlPointsStates
}