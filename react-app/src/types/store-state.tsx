/*
interface ControlPointState {
  id:string
  isHidden?:string
  x:number
  y:number
}

interface VanshingPointControlState {
  controlPoint1:ControlPointsState
  controlPoint2:ControlPointsState
  controlPoint3:ControlPointsState
  controlPoint4:ControlPointsState
  controlPoint4:ControlPointsState
}

interface ControlPointsState {
  * referenceDistanceVpIndex
  * referenceDistance
  * referenceDistanceUnit
  * pp
  * origin
  * vp1
}


interface ControlPointsState1Vp : ControlPointsState
  * horizon

interface ControlPointsState2Vp : ControlPointsState
  * vp2
  * vp3
  * vpCouplingMode

*/

interface CalibrationSettings {
  ppx:number
  ppy:number
}

export interface StoreState {
  calibrationSettings:CalibrationSettings
}