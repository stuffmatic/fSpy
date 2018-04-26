import { CalibrationMode, Point2D } from "../types/store-state";

export enum ActionTypes {
  SET_PRINCIPAL_POINT = "SET_PRINCIPAL_POINT",
  SET_ORIGIN = "SET_ORIGIN",
  SET_HORIZON = "SET_HORIZON",
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

//Set horizon
export interface SetHorizon {
  type: ActionTypes.SET_HORIZON,
  adjustStartingPoint:boolean,
  position:Point2D
}

export function setHorizon(adjustStartingPoint:boolean, position:Point2D): SetHorizon {
  return {
    type: ActionTypes.SET_HORIZON,
    adjustStartingPoint: adjustStartingPoint,
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
export type AppAction = SetPrincipalPoint| SetCalibrationMode | SetHorizon