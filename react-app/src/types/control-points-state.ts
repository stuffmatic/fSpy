
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
  lineSegments:[ControlPointPairState, ControlPointPairState]
}

export interface ControlPointsStateBase {
  principalPoint:ControlPointState
  origin:ControlPointState
  referenceDistanceAnchor:ControlPointState
  //The offsets are the distances in relative image coordinates
  //along the axis from the anchor to the vanishing point corresponding
  //to the selected reference axis
  referenceDistanceHandleOffsets:[number, number]
}

export interface ControlPointsState1VP extends ControlPointsStateBase {
  horizon:ControlPointPairState
  vanishingPoints:[
    VanishingPointControlState
  ]
}

export interface ControlPointsState2VP extends ControlPointsStateBase {
  vanishingPoints:[
    VanishingPointControlState,
    VanishingPointControlState,
    VanishingPointControlState
  ]
}
