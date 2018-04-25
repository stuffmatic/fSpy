import { CalibrationMode, Point2D } from "../types/store-state";

//Set principal point
export const SET_PRINCIPAL_POINT = 'SET_PRINCIPAL_POINT';
export type SET_PRINCIPAL_POINT = typeof SET_PRINCIPAL_POINT;

export interface SetPrincipalPointPosition {
  type: SET_PRINCIPAL_POINT
  calibrationMode: CalibrationMode
  position:Point2D
}

export function setPrincipalPointPosition(calibrationMode: CalibrationMode, position:Point2D): SetPrincipalPointPosition {
  return {
    type: SET_PRINCIPAL_POINT,
    position: position,
    calibrationMode: calibrationMode
  }
}

//Set origin
export const SET_ORIGIN = 'SET_ORIGIN';
export type SET_ORIGIN = typeof SET_ORIGIN;

export interface SetOrigin {
  type: SET_ORIGIN
  calibrationMode: CalibrationMode
  position:Point2D
}

export function setOrigin(calibrationMode: CalibrationMode, position:Point2D): SetOrigin {
  return {
    type: SET_ORIGIN,
    position: position,
    calibrationMode: calibrationMode
  }
}

//Set horizon start
export const SET_HORIZON_START = 'SET_HORIZON_START';
export type SET_HORIZON_START = typeof SET_HORIZON_START;

export interface SetHorizonStartPosition {
  type: SET_HORIZON_START
  position:Point2D
}

export function setHorizonStartPosition(position:Point2D): SetHorizonStartPosition {
  return {
    type: SET_HORIZON_START,
    position: position
  }
}

//Set horizon end
export const SET_HORIZON_END = 'SET_HORIZON_END';
export type SET_HORIZON_END = typeof SET_HORIZON_END;

export interface SetHorizonEndPosition {
  type: SET_HORIZON_END
  position:Point2D
}

export function setHorizonEndPosition(position:Point2D): SetHorizonEndPosition {
  return {
    type: SET_HORIZON_END,
    position: position
  }
}

//Set active calibration mode
export const SET_CALIBRATION_MODE = 'SET_CALIBRATION_MODE';
export type SET_CALIBRATION_MODE = typeof SET_CALIBRATION_MODE;

export interface SetCalibrationMode {
  type: SET_CALIBRATION_MODE
  calibrationMode: CalibrationMode
}

export function setCalibrationMode(calibrationMode: CalibrationMode): SetCalibrationMode {
  return {
    type: SET_CALIBRATION_MODE,
    calibrationMode: calibrationMode
  }
}

//Define a type covering all actions
export type AppAction = SetPrincipalPointPosition | SetCalibrationMode | SetHorizonStartPosition | SetHorizonEndPosition