import { CalibrationMode } from "../types/global-settings";
import { ControlPointPairIndex } from "../types/control-points-state";
import { PrincipalPointMode1VP, PrincipalPointMode2VP, HorizonMode, Axis, ReferenceDistanceUnit } from "../types/calibration-settings";
import CalibrationResult from "../types/calibration-result";
import Point2D from "../solver/point-2d";

export enum ActionTypes {
  //Global settings actions
  SET_CALIBRATION_MODE = "SET_CALIBRATION_MODE",
  SET_IMAGE_OPACITY = "SET_IMAGE_OPACITY",
  SET_GRID_FLOOR_NORMAL = "SET_GRID_FLOOR_NORMAL",
  SET_CONTROL_POINTS_VISIBLE = "SET_CONTROL_POINTS_VISIBLE",
  SET_NOTES = "SET_NOTES",

  //Image loading actions
  SET_IMAGE_URL = "SET_IMAGE_URL",
  SET_IMAGE_SIZE = "SET_IMAGE_SIZE",

  //Calibration settings actions
  SET_HORIZON_MODE = "SET_HORIZON_MODE",
  SET_QUAD_MODE_ENABLED = "SET_QUAD_MODE_ENABLED",
  SET_PRINCIPAL_POINT_MODE_1VP = "SET_PRINCIPAL_POINT_MODE_1VP",
  SET_PRINCIPAL_POINT_MODE_2VP = "SET_PRINCIPAL_POINT_MODE_2VP",
  SET_VANISHING_POINT_AXIS_1VP = "SET_VANISHING_POINT_AXIS_1VP",
  SET_VANISHING_POINT_AXIS_2VP = "SET_VANISHING_POINT_AXIS_2VP",
  SET_REFERENCE_DISTANCE_1VP = "SET_REFERENCE_DISTANCE_1VP",
  SET_REFERENCE_DISTANCE_2VP = "SET_REFERENCE_DISTANCE_2VP",
  SET_REFERENCE_DISTANCE_UNIT_1VP = "SET_REFERENCE_DISTANCE_UNIT_1VP",
  SET_REFERENCE_DISTANCE_UNIT_2VP = "SET_REFERENCE_DISTANCE_UNIT_2VP",
  SET_REFERENCE_DISTANCE_AXIS_1VP = "SET_REFERENCE_DISTANCE_AXIS_1VP",
  SET_REFERENCE_DISTANCE_AXIS_2VP = "SET_REFERENCE_DISTANCE_AXIS_2VP",

  //Control point actions
  SET_PRINCIPAL_POINT = "SET_PRINCIPAL_POINT",
  SET_ORIGIN = "SET_ORIGIN",
  SET_REFERENCE_DISTANCE_ANCHOR = "SET_REFERENCE_DISTANCE_ANCHOR",
  ADJUST_HORIZON = "ADJUST_HORIZON",
  ADJUST_VANISHING_POINT = "ADJUST_VANISHING_POINT",
  ADJUST_REFERENCE_DISTANCE_HANDLE = "ADJUST_REFERENCE_DISTANCE_HANDLE",

  //
  SET_CALIBRATION_RESULT = "SET_CALIBRATION_RESULT",

  //
  SET_EXPORT_DIALOG_VISIBILITY = "SET_EXPORT_DIALOG_VISIBILITY"
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

//Set grid floor noraml
export interface SetGridFloorNormal {
  type: ActionTypes.SET_GRID_FLOOR_NORMAL
  axis: Axis | null
}

export function setGridFloorNormal(axis: Axis | null): SetGridFloorNormal {
  return {
    type: ActionTypes.SET_GRID_FLOOR_NORMAL,
    axis: axis
  }
}

//Set control point visiblitiy
export interface SetControlPointsVisible {
  type: ActionTypes.SET_CONTROL_POINTS_VISIBLE
  visible: boolean
}

export function setControlPointsVisible(visible:boolean): SetControlPointsVisible {
  return {
    type: ActionTypes.SET_CONTROL_POINTS_VISIBLE,
    visible: visible
  }
}

//Set notes
export interface SetNotes {
  type: ActionTypes.SET_NOTES
  notes: string
}

export function setNotes(notes: string): SetNotes {
  return {
    type: ActionTypes.SET_NOTES,
    notes: notes
  }
}

//
export interface SetImageURL {
  type: ActionTypes.SET_IMAGE_URL
  url: string
}

export function setImageUrl(url: string): SetImageURL {
  return {
    type: ActionTypes.SET_IMAGE_URL,
    url: url
  }
}

//
export interface SetImageSize {
  type: ActionTypes.SET_IMAGE_SIZE
  width: number | null
  height: number | null
}

export function setImageSize(width: number | null, height: number | null): SetImageSize {
  return {
    type: ActionTypes.SET_IMAGE_SIZE,
    width: width,
    height: height
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

//
export interface SetVanishingPointAxis1VP {
  type: ActionTypes.SET_VANISHING_POINT_AXIS_1VP
  axis: Axis
}

export function setVanishingPointAxis1VP(axis: Axis): SetVanishingPointAxis1VP {
  return {
    type: ActionTypes.SET_VANISHING_POINT_AXIS_1VP,
    axis: axis
  }
}

//
export interface SetVanishingPointAxis2VP {
  type: ActionTypes.SET_VANISHING_POINT_AXIS_2VP,
  vanishingPointIndex:number,
  axis: Axis
}

export function setVanishingPointAxis2VP(vanishingPointIndex: number, axis: Axis): SetVanishingPointAxis2VP {
  return {
    type: ActionTypes.SET_VANISHING_POINT_AXIS_2VP,
    vanishingPointIndex: vanishingPointIndex,
    axis: axis
  }
}

//
export interface SetReferenceDistance1VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_1VP,
  distance: number
}

export function setReferenceDistance1VP(distance:number): SetReferenceDistance1VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_1VP,
    distance: distance
  }
}

//
export interface SetReferenceDistance2VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_2VP,
  distance: number
}

export function setReferenceDistance2VP(distance:number): SetReferenceDistance2VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_2VP,
    distance: distance
  }
}

//
export interface SetReferenceDistanceUnit1VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_UNIT_1VP,
  unit: ReferenceDistanceUnit
}

export function setReferenceDistanceUnit1VP(unit:ReferenceDistanceUnit): SetReferenceDistanceUnit1VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_UNIT_1VP,
    unit: unit
  }
}

//
export interface SetReferenceDistanceUnit2VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_UNIT_2VP,
  unit: ReferenceDistanceUnit
}

export function setReferenceDistanceUnit2VP(unit:ReferenceDistanceUnit): SetReferenceDistanceUnit2VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_UNIT_2VP,
    unit: unit
  }
}

//
export interface SetReferenceDistanceAxis1VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_AXIS_1VP,
  axis: Axis | null
}

export function setReferenceDistanceAxis1VP(axis: Axis | null): SetReferenceDistanceAxis1VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_AXIS_1VP,
    axis: axis
  }
}

//
export interface SetReferenceDistanceAxis2VP {
  type: ActionTypes.SET_REFERENCE_DISTANCE_AXIS_2VP,
  axis: Axis | null
}

export function setReferenceDistanceAxis2VP(axis: Axis | null): SetReferenceDistanceAxis2VP {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_AXIS_2VP,
    axis: axis
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

//Set reference distance anchor
export interface SetReferenceDistanceAnchor {
  type: ActionTypes.SET_REFERENCE_DISTANCE_ANCHOR
  calibrationMode: CalibrationMode
  position: Point2D
}

export function setReferenceDistanceAnchor(calibrationMode: CalibrationMode, position: Point2D): SetReferenceDistanceAnchor {
  return {
    type: ActionTypes.SET_REFERENCE_DISTANCE_ANCHOR,
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

//Adjust a vanishing point (i.e set the position of an endpoint of a line
//segment of a vanishing point control)
export interface AdjustVanishingPoint {
  type: ActionTypes.ADJUST_VANISHING_POINT,
  calibrationMode: CalibrationMode,
  vanishingPointIndex: number,
  lineSegmentIndex: number,
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
}

export function adjustVanishingPoint(
  calibrationMode: CalibrationMode,
  vanshingPointIndex: number,
  lineSegmentIndex: number,
  controlPointIndex: ControlPointPairIndex,
  position: Point2D
): AdjustVanishingPoint {
  return {
    type: ActionTypes.ADJUST_VANISHING_POINT,
    calibrationMode: calibrationMode,
    vanishingPointIndex: vanshingPointIndex,
    lineSegmentIndex: lineSegmentIndex,
    controlPointIndex: controlPointIndex,
    position: position
  }
}

//

export interface AdjustReferenceDistanceHandle {
  type: ActionTypes.ADJUST_REFERENCE_DISTANCE_HANDLE,
  calibrationMode: CalibrationMode,
  handleIndex: number,
  position: number
}

export function adjustReferenceDistanceHandle(
  calibrationMode: CalibrationMode,
  handleIndex: number,
  position: number
): AdjustReferenceDistanceHandle {
  return {
    type: ActionTypes.ADJUST_REFERENCE_DISTANCE_HANDLE,
    calibrationMode: calibrationMode,
    handleIndex: handleIndex,
    position: position
  }
}

//Set calibration result
export interface SetCalibrationResult {
  type: ActionTypes.SET_CALIBRATION_RESULT,
  result: CalibrationResult
}

export function setCalibrationResult(result:CalibrationResult): SetCalibrationResult {
  return {
    type: ActionTypes.SET_CALIBRATION_RESULT,
    result: result
  }
}

//
export interface SetExportDialogVisibility {
  type: ActionTypes.SET_EXPORT_DIALOG_VISIBILITY,
  isVisible: boolean
}

export function setExportDialogVisibility(isVisible:boolean): SetExportDialogVisibility {
  return {
    type: ActionTypes.SET_EXPORT_DIALOG_VISIBILITY,
    isVisible: isVisible
  }
}


//Define a type covering all actions
export type AppAction =
  SetCalibrationMode |
  SetImageOpacity |
  SetGridFloorNormal |
  SetControlPointsVisible |
  SetNotes |
  SetImageURL |
  SetImageSize |
  SetHorizonMode |
  SetQuadModeEnabled |
  SetPrincipalPointMode1VP |
  SetPrincipalPointMode2VP |
  SetVanishingPointAxis1VP | 
  SetVanishingPointAxis2VP | 
  SetReferenceDistanceAxis1VP |
  SetReferenceDistanceAxis2VP |
  SetReferenceDistanceUnit1VP |
  SetReferenceDistanceUnit2VP |
  SetReferenceDistance1VP |
  SetReferenceDistance2VP |
  SetOrigin |
  SetReferenceDistanceAnchor |
  SetPrincipalPoint |
  AdjustHorizon |
  AdjustReferenceDistanceHandle |
  AdjustVanishingPoint |
  SetCalibrationResult | 
  SetExportDialogVisibility