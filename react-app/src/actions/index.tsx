import { CalibrationMode } from "../types/global-settings";
import { Point2D, ControlPointPairIndex } from "../types/control-points-state";
import { PrincipalPointMode1VP, PrincipalPointMode2VP, HorizonMode } from "../types/calibration-settings";

export enum ActionTypes {
  //Global settings action
  SET_CALIBRATION_MODE = "SET_CALIBRATION_MODE",
  SET_IMAGE_OPACITY = "SET_IMAGE_OPACITY",

  //Calibration settings actions
  SET_HORIZON_MODE = "SET_HORIZON_MODE",
  SET_QUAD_MODE_ENABLED = "SET_QUAD_MODE_ENABLED",
  SET_PRINCIPAL_POINT_MODE_1VP = "SET_PRINCIPAL_POINT_MODE_1VP",
  SET_PRINCIPAL_POINT_MODE_2VP = "SET_PRINCIPAL_POINT_MODE_2VP",

  //Control point actions
  SET_PRINCIPAL_POINT = "SET_PRINCIPAL_POINT",
  SET_ORIGIN = "SET_ORIGIN",
  ADJUST_HORIZON = "ADJUST_HORIZON",
  ADJUST_VANISHING_LINE = "ADJUST_VANISHING_LINE",

  //
  COMPUTE_CALIBRATION_RESULT = "COMPUTE_CALIBRATION_RESULT"
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

//
export interface SetHorizonMode {
  type: ActionTypes.SET_HORIZON_MODE
  horizonMode: HorizonMode
}

export function setHorizonMode(horizonMode: HorizonMode): SetHorizonMode {
  return {
    type: ActionTypes.SET_HORIZON_MODE,
    horizonMode: horizonMode
  }
}

//
export interface SetQuadModeEnabled {
  type: ActionTypes.SET_QUAD_MODE_ENABLED
  quadModeEnabled: boolean
}

export function setQuadModeEnabled(quadModeEnabled: boolean): SetQuadModeEnabled {
  return {
    type: ActionTypes.SET_QUAD_MODE_ENABLED,
    quadModeEnabled: quadModeEnabled
  }
}

//
export interface SetPrincipalPointMode1VP {
  type: ActionTypes.SET_PRINCIPAL_POINT_MODE_1VP
  principalPointMode: PrincipalPointMode1VP
}

export function setPrincipalPointMode1VP(principalPointMode: PrincipalPointMode1VP): SetPrincipalPointMode1VP {
  return {
    type: ActionTypes.SET_PRINCIPAL_POINT_MODE_1VP,
    principalPointMode: principalPointMode
  }
}

//
export interface SetPrincipalPointMode2VP {
  type: ActionTypes.SET_PRINCIPAL_POINT_MODE_2VP
  principalPointMode: PrincipalPointMode2VP
}

export function setPrincipalPointMode2VP(principalPointMode: PrincipalPointMode2VP): SetPrincipalPointMode2VP {
  return {
    type: ActionTypes.SET_PRINCIPAL_POINT_MODE_2VP,
    principalPointMode: principalPointMode
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

//Compute calibration result
export interface ComputeCalibrationResult {
  type: ActionTypes.COMPUTE_CALIBRATION_RESULT
}

export function computeCalibrationResult(): ComputeCalibrationResult {
  return {
    type: ActionTypes.COMPUTE_CALIBRATION_RESULT
  }
}

//Define a type covering all actions
export type AppAction =
  SetCalibrationMode |
  SetImageOpacity |
  SetHorizonMode |
  SetQuadModeEnabled |
  SetPrincipalPointMode1VP |
  SetPrincipalPointMode2VP |
  SetOrigin |
  SetPrincipalPoint |
  AdjustHorizon |
  AdjustVanishingLine | 
  ComputeCalibrationResult