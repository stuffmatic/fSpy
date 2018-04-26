import { CalibrationMode, Point2D } from "../types/store-state";

export enum ActionTypes {
  SET_PRINCIPAL_POINT = "SET_PRINCIPAL_POINT",
  SET_ORIGIN = "SET_ORIGIN",
  SET_HORIZON_START = "SET_HORIZON_START",
  SET_HORIZON_END = "SET_HORIZON_END",
  SET_CALIBRATION_MODE = "SET_CALIBRATION_MODE"
}

//Set principal point
export interface SetPrincipalPoint {
  type: ActionTypes.SET_PRINCIPAL_POINT
  calibrationMode: CalibrationMode
  position:Point2D
}

export function setPrincipalPoint(calibrationMode: CalibrationMode, position:Point2D): SetPrincipalPoint {
  return {
    type: ActionTypes.SET_PRINCIPAL_POINT,
    position: position,
    calibrationMode: calibrationMode
  }
}

//Set origin
export interface SetOrigin {
  type: ActionTypes.SET_ORIGIN
  calibrationMode: CalibrationMode
  position:Point2D
}

export function setOrigin(calibrationMode: CalibrationMode, position:Point2D): SetOrigin {
  return {
    type: ActionTypes.SET_ORIGIN,
    position: position,
    calibrationMode: calibrationMode
  }
}

//Set horizon start
export interface SetHorizonStartPosition {
  type: ActionTypes.SET_HORIZON_START
  position:Point2D
}

export function setHorizonStartPosition(position:Point2D): SetHorizonStartPosition {
  return {
    type: ActionTypes.SET_HORIZON_START,
    position: position
  }
}

//Set horizon end
export interface SetHorizonEndPosition {
  type: ActionTypes.SET_HORIZON_END
  position:Point2D
}

export function setHorizonEndPosition(position:Point2D): SetHorizonEndPosition {
  return {
    type: ActionTypes.SET_HORIZON_END,
    position: position
  }
}

//Set active calibration mode
export interface SetCalibrationMode {
  type: ActionTypes.SET_CALIBRATION_MODE
  calibrationMode: CalibrationMode
}

export function setCalibrationMode(calibrationMode: CalibrationMode): SetCalibrationMode {
  return {
    type: ActionTypes.SET_CALIBRATION_MODE,
    calibrationMode: calibrationMode
  }
}

//Define a type covering all actions
export type AppAction = SetPrincipalPoint| SetCalibrationMode | SetHorizonStartPosition | SetHorizonEndPosition