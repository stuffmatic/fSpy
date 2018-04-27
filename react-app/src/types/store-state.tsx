
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

//Rename to BinaryIndex or something? Or remove if it doesnt provide type info
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
  vanishingPoints:[
    VanishingPointControlState
  ]
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

export interface GlobalSettings {
  calibrationMode:CalibrationMode
  imageOpacity:number
}


/*
export enum PrincipalPointMode1VP {
  Default = "Default",
  Manual = "Manual"
}

export enum Axis {
  PositiveX = "PositiveX",
  NegativeX = "NegativeX",
  PositiveY = "PositiveY",
  NegativeY = "NegativeY",
  PositiveZ = "PositiveZ",
  NegativeZ = "NegativeZ",
}

export interface CalibrationSettings1VP {
  principalPointMode:PrincipalPointMode1VP
}



export enum PrincipalPointMode2VP {
  Default = "Default",
  Manual = "Manual",
  FromThirdVanishingPoint = "FromThirdVanishingPoint"
}

export interface CalibrationSettings2VP {
  principalPointMode:PrincipalPointMode2VP

}
*/


export interface StoreState {
  globalSettings:GlobalSettings

  //calibrationSettings1VP:CalibrationSettings1VP
  controlPointsState1VP:ControlPointsState1VP

  //calibrationSettings2VP:CalibrationSettings2VP
  controlPointsState2VP:ControlPointsState2VP
}