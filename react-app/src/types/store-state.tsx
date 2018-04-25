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
}

export interface ControlPointsState1VP extends ControlPointsStateBase {
  /* horizon */
  dummy:string
}

export interface ControlPointsState2VP extends ControlPointsStateBase {
  /*  referenceDistanceVpIndex */
  /* vp2 */
  /* vp3 */
  /* vpCouplingMode */
  dummy:number
}

export enum CalibrationMode {
  OneVanishingPoint = "OneVanishingPoint",
  TwoVanishingPoints = "TwoVanishingPoints"
}

export interface StoreState {
  calibrationMode:CalibrationMode
  controlPointsState1VP:ControlPointsState1VP
  controlPointsState2VP:ControlPointsState2VP
}