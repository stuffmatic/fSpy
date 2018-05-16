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
import { CalibrationSettingsBase, Axis } from '../../types/calibration-settings';
import Vector3D from '../../solver/vector-3d';

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


    function vpIndexForAxis(positiveAxis: Axis): number {
      let negativeAxis = Axis.NegativeX
      switch (positiveAxis) {
        case Axis.PositiveY:
          negativeAxis = Axis.NegativeY
          break
        case Axis.PositiveZ:
          negativeAxis = Axis.NegativeZ
          break
      }

      for (let vpIndex = 0; vpIndex < 3; vpIndex++) {
        let vpAxis = result.vanishingPointAxes![vpIndex]
        if (vpAxis == positiveAxis || vpAxis == negativeAxis) {
          return vpIndex
        }
      }

      return 0
    }

    let referenceAxisVpIndex = vpIndexForAxis(referenceAxis)
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

    let offset0 = controlPointsState.referenceDistanceHandleOffsets[0]
    let offset1 = controlPointsState.referenceDistanceHandleOffsets[1]
    let handlePositions: [Point2D, Point2D] = [
      { x: positionRel.x + offset0 * anchorToVpRel.x, y: positionRel.y + offset0 * anchorToVpRel.y },
      { x: positionRel.x + offset1 * anchorToVpRel.x, y: positionRel.y + offset1 * anchorToVpRel.y }
    ]


    //////MOVE
    let unprojectedN = MathUtil.perspectiveUnproject(
      new Vector3D(position.x, position.y, 1),
      result
    )
    let unprojectedF = MathUtil.perspectiveUnproject(
      new Vector3D(position.x, position.y, 2),
      result
    )
    console.log("ray " + JSON.stringify(unprojectedF) + " - " + JSON.stringify(unprojectedN))
    let xp = new Vector3D(1)
    let yp = new Vector3D(0, 1)
    let op = new Vector3D()
    let referencePlaneIntersection = MathUtil.linePlaneIntersection(
      op, xp, yp,
      unprojectedN, unprojectedF
    )
    console.log("  ray xy plane intersection " + JSON.stringify(referencePlaneIntersection))

    let referenceDistanceRayEnd = referencePlaneIntersection.copy()
    referenceDistanceRayEnd.z = 1

    let handle1 = CoordinatesUtil.convert(
      handlePositions[0],
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      this.props.width,
      this.props.height
    )

    let handle1RayStart = MathUtil.perspectiveUnproject(new Vector3D(handle1.x, handle1.y, 1), result)
    let handle1RayEnd = MathUtil.perspectiveUnproject(new Vector3D(handle1.x, handle1.y, 2), result)

    let inters = MathUtil.shortestLineSegmentBetweenLines(handle1RayStart, handle1RayEnd, referencePlaneIntersection, referenceDistanceRayEnd)
    console.log("inters " + JSON.stringify(inters))

    //////MOVE


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