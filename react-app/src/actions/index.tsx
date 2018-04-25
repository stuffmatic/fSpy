import { CalibrationMode } from "../types/store-state";

export const SET_PRINCIPAL_POINT_POSITION = 'SET_PRINCIPAL_POINT_POSITION';
export type SET_PRINCIPAL_POINT_POSITION = typeof SET_PRINCIPAL_POINT_POSITION;

export const SET_CALIBRATION_MODE = 'SET_CALIBRATION_MODE';
export type SET_CALIBRATION_MODE = typeof SET_CALIBRATION_MODE;

export interface SetPrincipalPointPosition {
  type: SET_PRINCIPAL_POINT_POSITION
  x: number
  y: number
}

export interface SetCalibrationMode {
  type: SET_CALIBRATION_MODE
  calibrationMode: CalibrationMode
}

export type AppAction = SetPrincipalPointPosition | SetCalibrationMode

export function setPrincipalPointPosition(x: number, y: number): SetPrincipalPointPosition {
  return {
    type: SET_PRINCIPAL_POINT_POSITION,
    x: x,
    y: y
  }
}

export function setCalibrationMode(calibrationMode: CalibrationMode): SetCalibrationMode {
  return {
    type: SET_CALIBRATION_MODE,
    calibrationMode: calibrationMode
  }
}
