import * as React from 'react';
import { ControlPointsContainerDimensionProps, ControlPointsContainerCallbacks, ControlPointsContainerProps } from '../../containers/control-points-container';
import { VanishingPointControlState, ControlPointPairState, ControlPointPairIndex, ControlPointsStateBase } from '../../types/control-points-state';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';
import Point2D from '../../solver/point-2d';
import { CalibrationMode } from '../../types/global-settings';
import PrincipalPointControl from './principal-point-control'
import OriginControl from './origin-control'
import ReferenceDistanceControl from './reference-distance-control'
import MathUtil from '../../solver/math-util';
import { CalibrationSettingsBase } from '../../types/calibration-settings';
import Solver from '../../solver/solver';

type ControlPointsPanelProps = ControlPointsContainerDimensionProps & ControlPointsContainerCallbacks & ControlPointsContainerProps

export default class ControlPointsPanelBase extends React.PureComponent<ControlPointsPanelProps> {

  protected renderPrincipalPointControl(position: Point2D | null, isEnabled: boolean, isVisible: boolean) {
    if (!isVisible) {
      return null
    }

    return (
      <PrincipalPointControl
        position={
          CoordinatesUtil.convert(
            position ? position : { x: 0.5, y: 0.5 }, //use default position if no position is specified. TODO: store default as a constant
            ImageCoordinateFrame.Relative,
            ImageCoordinateFrame.Absolute,
            this.props.width,
            this.props.height
          )
        }
        enabled={isEnabled}
        dragCallback={(position: Point2D) => {
          this.invokeControlPointDragCallback(
            position,
            this.props.onPrincipalPointDrag
          )
        }}
      />
    )
  }

  protected renderOriginControl(position: Point2D) {
    return (
      <OriginControl
        position={
          this.rel2AbsPoint(position)
        }
        dragCallback={(position: Point2D) => {
          this.invokeControlPointDragCallback(
            position,
            this.props.onOriginDrag
          )
        }}
      />
    )
  }

  protected renderReferenceDistanceControl(position: Point2D) {
    let is1VP = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let settings: CalibrationSettingsBase = is1VP ? this.props.calibrationSettings1VP : this.props.calibrationSettings2VP
    let result = is1VP ? this.props.calibrationResult.calibrationResult1VP : this.props.calibrationResult.calibrationResult2VP
    let controlPointsState: ControlPointsStateBase = is1VP ? this.props.controlPointsState1VP : this.props.controlPointsState2VP

    let referenceAxis = settings.referenceDistanceAxis
    if (referenceAxis == null) {
      return null
    }

    if (!result.vanishingPoints || !result.vanishingPointAxes) {
      return
    }

    let referenceAxisVpIndex = Solver.vanishingPointIndexForAxis(
      referenceAxis,
      result.vanishingPointAxes
    )
    let uIndex = (referenceAxisVpIndex + 1) % 3
    let vIndex = (referenceAxisVpIndex + 2) % 3

    let positionRel = position
    position = CoordinatesUtil.convert(
      position,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      this.props.width,
      this.props.height
    )

    let origin = CoordinatesUtil.convert(
      controlPointsState.origin,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      this.props.width,
      this.props.height
    )

    let uIntersection = CoordinatesUtil.convert(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[uIndex]],
        [position, result.vanishingPoints[vIndex]]
      )!,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )

    let vIntersection = CoordinatesUtil.convert(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[vIndex]],
        [position, result.vanishingPoints[uIndex]]
      )!,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )

    let posAbs = CoordinatesUtil.convert(
      position,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )

    let originAbs = CoordinatesUtil.convert(
      origin,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )

    //anchor point + length
    let referenceAxisVpRel = CoordinatesUtil.convert(
      result.vanishingPoints[referenceAxisVpIndex],
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      this.props.width,
      this.props.height
    )

    let anchorToVpRel = MathUtil.normalized({
      x: referenceAxisVpRel.x - positionRel.x,
      y: referenceAxisVpRel.y - positionRel.y
    })

    let handlePositions = Solver.referenceDistanceHandlesRelativePositions(
      controlPointsState,
      referenceAxis,
      result.vanishingPoints,
      result.vanishingPointAxes,
      this.props.width,
      this.props.height
    )

    return (
      <ReferenceDistanceControl
        origin={originAbs}
        uIntersection={uIntersection}
        vIntersection={vIntersection}
        anchorPosition={
          posAbs
        }
        handlePositions={
          [
            this.rel2AbsPoint(handlePositions[0]),
            this.rel2AbsPoint(handlePositions[1])
          ]
        }
        anchorDragCallback={(position: Point2D) => {
          this.invokeControlPointDragCallback(
            position,
            this.props.onReferenceDistanceAnchorDrag
          )
        }}
        handleDragCallback={(handleIndex: number, dragPosition: Point2D) => {
          let dragRel = CoordinatesUtil.convert(
            dragPosition,
            ImageCoordinateFrame.Absolute,
            ImageCoordinateFrame.Relative,
            this.props.width,
            this.props.height
          )
          let a = {x: dragRel.x - positionRel.x, y: dragRel.y - positionRel.y}
          let offset = MathUtil.dot(anchorToVpRel, a)
          this.props.onReferenceDistanceHandleDrag(
            this.props.globalSettings.calibrationMode,
            handleIndex,
            offset
          )
        }}
      />
    )
  }

  protected rel2AbsVanishingPointControlState(state: VanishingPointControlState): VanishingPointControlState {
    return {
      lineSegments: [
        this.rel2AbsControlPointPairState(state.lineSegments[0]),
        this.rel2AbsControlPointPairState(state.lineSegments[1])
      ]
    }
  }

  protected rel2AbsControlPointPairState(rel: ControlPointPairState): ControlPointPairState {
    return [
      this.rel2AbsPoint(rel[0]),
      this.rel2AbsPoint(rel[1])
    ]
  }

  protected rel2AbsPoint(rel: Point2D): Point2D {
    return CoordinatesUtil.convert(
      rel,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )
  }

  protected imgPlane2AbsPoint(imagePlanePoint: Point2D): Point2D {
    return CoordinatesUtil.convert(
      imagePlanePoint,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )
  }

  protected invokeControlPointDragCallback(
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }

  protected invokeEndpointDragCallback(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, controlPointIndex: ControlPointPairIndex, position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      controlPointIndex,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }

  protected invokeVanishingPointDragCallback(
    vanishingPointIndex: number,
    lineSegmentIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode,
      vanishingPointIndex: number,
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      vanishingPointIndex,
      lineSegmentIndex,
      controlPointIndex,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }
}