import * as React from 'react';
import { ControlPointsContainerDimensionProps, ControlPointsContainerCallbacks, ControlPointsContainerProps } from '../../containers/control-points-container';
import { VanishingPointControlState, ControlPointPairState, ControlPointPairIndex, ControlPointsStateBase } from '../../types/control-points-state';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';
import Point2D from '../../solver/point-2d';
import { CalibrationMode } from '../../types/global-settings';
import PrincipalPointControl from './principal-point-control'
import OriginControl from './origin-control'
import ReferenceDistanceAnchorControl from './reference-distance-anchor-control'
import MathUtil from '../../solver/math-util';

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

  protected renderReferenceDistanceAnchorControl(position: Point2D) {
    let is1VP = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let result = is1VP ? this.props.calibrationResult.calibrationResult1VP : this.props.calibrationResult.calibrationResult2VP
    let controlPointsState: ControlPointsStateBase = is1VP ? this.props.controlPointsState1VP : this.props.controlPointsState2VP

    if (!result.vanishingPoints) {
      return
    }

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

    let lol = CoordinatesUtil.convert(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[0]],
        [position, result.vanishingPoints[1]]
      )!,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )

    let face = CoordinatesUtil.convert(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[1]],
        [position, result.vanishingPoints[0]]
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

    return (
      <ReferenceDistanceAnchorControl
        origin={originAbs}
        uIntersection={lol}
        vIntersection={face}
        position={
          posAbs
        }
        dragCallback={(position: Point2D) =>  {
          this.invokeControlPointDragCallback(
            position,
            this.props.onReferenceDistanceAnchorDrag
          )
        }}
      />
    )

    /*
    let settings: CalibrationSettingsBase = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint ? this.props.calibrationSettings1VP : this.props.calibrationSettings2VP
    let referenceAxis = settings.referenceDistanceAxis
    let result = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint ? this.props.calibrationResult.calibrationResult1VP : this.props.calibrationResult.calibrationResult2VP


    )*/
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