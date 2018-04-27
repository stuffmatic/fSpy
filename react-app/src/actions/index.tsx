import { CalibrationMode } from "../types/global-settings";
import { Point2D, ControlPointPairIndex } from "../types/control-points-state";

export enum ActionTypes {
  //Global settings action
  SET_CALIBRATION_MODE = "SET_CALIBRATION_MODE",
  SET_IMAGE_OPACITY = "SET_IMAGE_OPACITY",

  //Control point actions
  SET_PRINCIPAL_POINT = "SET_PRINCIPAL_POINT",
  SET_ORIGIN = "SET_ORIGIN",
  ADJUST_HORIZON = "ADJUST_HORIZON",
  ADJUST_VANISHING_LINE = "ADJUST_VANISHING_LINE"
}


//Set image opacity
export interface SetImageOpacity {
  type: ActionTypes.SET_IMAGE_OPACITY
  opacity: number
}

export function setImageOpacity(opacity: number): SetImageOpacity {
  return {
    type: ActionTypes.SET_IMAGE_OPACITY,
    opacity: opacity
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

//Set principal point
export interface SetPrincipalPoint {
  type: ActionTypes.SET_PRINCIPAL_POINT
  calibrationMode: CalibrationMode
  position: Point2D
}

export function setPrincipalPoint(calibrationMode: CalibrationMode, position: Point2D): SetPrincipalPoint {
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
  position: Point2D
}

export function setOrigin(calibrationMode: CalibrationMode, position: Point2D): SetOrigin {
  return {
    type: ActionTypes.SET_ORIGIN,
    position: position,
    calibrationMode: calibrationMode
  }
}

//Adjust horizon (i.e set the position one endpoint of the horizon line)
export interface AdjustHorizon {
  type: ActionTypes.ADJUST_HORIZON,
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
}

export function adjustHorizon(
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
): AdjustHorizon {
  return {
    type: ActionTypes.ADJUST_HORIZON,
    controlPointIndex: controlPointIndex,
    position: position
  }
}

//Adjust vanishing line (i.e set the position of one endpoint of a vanishing line)
export interface AdjustVanishingLine {
  type: ActionTypes.ADJUST_VANISHING_LINE,
  calibrationMode: CalibrationMode,
  vanishingPointIndex: number,
  vanishingLineIndex: number,
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
}

export function adjustVanishingLine(
  calibrationMode: CalibrationMode,
  vanshingPointIndex: number,
  vanishingLineIndex: number,
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
): AdjustVanishingLine {
  return {
    type: ActionTypes.ADJUST_VANISHING_LINE,
    calibrationMode: calibrationMode,
    vanishingPointIndex: vanshingPointIndex,
    vanishingLineIndex: vanishingLineIndex,
    controlPointIndex: controlPointIndex,
    position: position
  }
}

//Define a type covering all actions
export type AppAction =
  SetCalibrationMode |
  SetImageOpacity |
  SetOrigin |
  SetPrincipalPoint |
  AdjustHorizon |
  AdjustVanishingLine