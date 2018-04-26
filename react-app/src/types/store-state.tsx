
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

export type ControlPointPairState = [ControlPointState, ControlPointState]

export enum ControlPointPairIndex {
  First = 0,
  Second = 1
}

export interface VanishingPointControlState {
  vanishingLines:[ControlPointPairState, ControlPointPairState]
}

export interface ControlPointsStateBase {
  /*
  referenceDistance
  referenceDistanceUnit
  */
  principalPoint:ControlPointState
  origin:ControlPointState
}

export interface ControlPointsState1VP extends ControlPointsStateBase {
  horizon:ControlPointPairState
  vanishingPoint:VanishingPointControlState
}

export interface ControlPointsState2VP extends ControlPointsStateBase {
  /*  referenceDistanceVpIndex */
  /* vpCouplingMode */
  vanishingPoints:[
    VanishingPointControlState,
    VanishingPointControlState,
    VanishingPointControlState
  ]
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