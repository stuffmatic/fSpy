/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react'
import { Stage, Layer, Group } from 'react-konva'
import Measure, { ContentRect } from 'react-measure'
import Point2D from '../../solver/point-2d'
import AABB from '../../solver/aabb'
import { ControlPointsContainerCallbacks } from '../../containers/control-points-container'
import OriginControl from '../../components/control-points-panel/origin-control'
import { ControlPointsStateBase, ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState, ControlPointPairState, ControlPointPairIndex } from '../../types/control-points-state'
import { GlobalSettings, CalibrationMode } from '../../types/global-settings'
import { ImageState } from '../../types/image-state'
import VanishingPointControl from './vanishing-point-control'
import { Palette } from '../../style/palette'
import HorizonControl from './horizon-control'
import { CalibrationSettings1VP, CalibrationSettingsBase, CalibrationSettings2VP, PrincipalPointMode2VP, PrincipalPointMode1VP, Axis } from '../../types/calibration-settings'
import PrincipalPointControl from './principal-point-control'
import { SolverResult } from '../../solver/solver-result'
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util'
import Overlay3DPanel from './overlay-3d-panel'
import ReferenceDistanceControl from './reference-distance-control'
import Solver from '../../solver/solver'
import MathUtil from '../../solver/math-util'
import AABBOps from '../../solver/aabb-ops'
import MagnifyingGlass from './magnifying-glass'

interface ControlPointsPanelState {
  width: number | undefined
  height: number | undefined
  magnifyingGlassPosition: Point2D
  isDraggingControlPoint: boolean
  shiftIsDown: boolean
}

export interface ControlPointsPanelProps {
  globalSettings: GlobalSettings
  imageState: ImageState
  callbacks: ControlPointsContainerCallbacks

  calibrationSettingsBase: CalibrationSettingsBase
  calbrationSettings1VP: CalibrationSettings1VP
  calbrationSettings2VP: CalibrationSettings2VP

  controlPointsStateBase: ControlPointsStateBase
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP

  solverResult: SolverResult

  applyImagePadding: boolean
}

export default class ControlPointsPanel extends React.Component<ControlPointsPanelProps, ControlPointsPanelState> {

  constructor(props: ControlPointsPanelProps) {
    super(props)

    this.state = {
      width: undefined,
      height: undefined,
      magnifyingGlassPosition: {
        x: 0, y: 0
      },
      isDraggingControlPoint: false,
      shiftIsDown: false
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', (_) => {
      this.setState({
        ...this.state,
        isDraggingControlPoint: false
      })
    })
    document.addEventListener('keydown', (event) => {
      if (event.key == 'Shift') {
        this.setState({
          ...this.state,
          shiftIsDown: true
        })
      }
    })
    document.addEventListener('keyup', (event) => {
      if (event.key == 'Shift') {
        this.setState({
          ...this.state,
          shiftIsDown: false
        })
      }
    })
  }

  componentWillUnmount() {
    //
  }

  render() {
    let width = this.state.width
    let height = this.state.height

    let hasImage = this.props.imageState.url !== null

    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    return (
      <div id='center-panel'>
        <Measure
          client
          bounds
          offset
          onResize={(contentRect: ContentRect) => {
            let newWidth = contentRect.bounds !== undefined ? contentRect.bounds.width : undefined
            let newHeight = contentRect.bounds !== undefined ? contentRect.bounds.height : undefined
            this.setState({
              ...this.state,
              width: newWidth,
              height: newHeight
            })
          }}
        >
          {({ measureRef }) => {
            return (<div id='image-panel' ref={measureRef} >
              {hasImage ? this.renderImageAndControlPoints(width, height, is1VPMode) : null }
            </div>
            )
          }
          }
        </Measure>
      </div>
    )
  }

  // TODO: make private
  didDragControlPoint(absolutePosition: Point2D, referenceDistanceHandleIndex: number | undefined = undefined) {
    if (this.state.height) {

      let magnifyingGlassPosition = this.clampedAbsPoint(absolutePosition)
      if (referenceDistanceHandleIndex !== undefined && this.props.solverResult.cameraParameters) {
        const cameraParameters = this.props.solverResult.cameraParameters
        const referenceAxis = this.props.calibrationSettingsBase.referenceDistanceAxis
        const imageWidth = this.props.imageState.width
        const imageHeight = this.props.imageState.height
        if (imageWidth && imageHeight && referenceAxis) {
          let handlePositions = Solver.referenceDistanceHandlesRelativePositions(
            this.props.controlPointsStateBase,
            referenceAxis,
            cameraParameters.vanishingPoints,
            cameraParameters.vanishingPointAxes,
            imageWidth,
            imageHeight
          )
          magnifyingGlassPosition = this.rel2AbsPoint(handlePositions[referenceDistanceHandleIndex])
        }
      }

      this.setState({
        ...this.state,
        isDraggingControlPoint: true,
        magnifyingGlassPosition: magnifyingGlassPosition
      })
    }
  }

  private renderImageAndControlPoints(
    width: number | undefined,
    height: number | undefined,
    is1VPMode: boolean
  ) {
    return (
      <div>
        {this.renderImage()}
        <Stage width={width} height={height}>
          <Layer>
            {this.render3DOverlay()}
            {is1VPMode ? this.render1VPControlPoints() : this.render2VPControlPoints()}
            {this.renderCommonControlPoints()}
          </Layer>
        </Stage>
        {this.renderMagnifyingGlass()}
      </div>
    )
  }

  private renderMagnifyingGlass() {
    if (!this.state.isDraggingControlPoint || !this.state.shiftIsDown) {
      return null
    }
    if (this.props.imageState.width == null || this.props.imageState.height == null) {
      return null
    }
    return (
      <MagnifyingGlass
        imageWith={this.props.imageState.width}
        imageHeight={this.props.imageState.height}
        imageSrc={this.props.imageState.url}
        position={{
          x: this.state.magnifyingGlassPosition.x,
          y: this.state.magnifyingGlassPosition.y - this.state.height!
        }}
        relativeImagePosition={this.abs2RelPoint(this.state.magnifyingGlassPosition, false)}
      />
    )
  }

  private render3DOverlay() {
    let imageAABB = this.imageAbsoluteAABB()
    let cameraParameters = this.props.solverResult.cameraParameters
    if (!cameraParameters || !imageAABB || !this.state.width || !this.state.height) {
      return null
    }
    return (
      <Overlay3DPanel
        referenceDistanceAxis={this.props.calibrationSettingsBase.referenceDistanceAxis}
        imageAABB={imageAABB}
        width={this.state.width}
        height={this.state.height}
        cameraParameters={cameraParameters}
        globalSettings={this.props.globalSettings}
      />
    )

  }

  private renderImage() {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return null
    }

    return (
      <img
        style={{
          opacity: this.props.globalSettings.imageOpacity,
          position: 'absolute',
          left: imageAABB.xMin,
          top: imageAABB.yMin
        }}
        src={this.props.imageState.url!}
        width={AABBOps.width(imageAABB)}
        height={AABBOps.height(imageAABB)}
      />
    )
  }

  private renderCommonControlPoints() {
    return (
      <Group>
        <VanishingPointControl
          vanishingPointIndex={0}
          color={this.vanishingPointColor(0)}
          controlState={
            this.rel2AbsVanishingPointControlState(
              this.props.controlPointsStateBase.firstVanishingPoint
            )
          }
          vanishingPoint={this.vanishingPointAbs(0)}
          onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
            this.didDragControlPoint(position)
            this.props.callbacks.onFirstVanishingPointControlPointDrag(
              lineSegmentIndex,
              pointPairIndex,
              this.abs2RelPoint(position)
            )
          }}
        />
        <OriginControl
          absolutePosition={this.rel2AbsPoint(this.props.controlPointsStateBase.origin)}
          dragCallback={(absolutePosition: Point2D) => {
            this.didDragControlPoint(absolutePosition)
            this.props.callbacks.onOriginDrag(
              this.abs2RelPoint(absolutePosition)
            )
          }}
        />
        {this.renderReferenceDistanceControl()}
      </Group>
    )
  }

  private renderReferenceDistanceControl() {
    let referenceAxis = this.props.calibrationSettingsBase.referenceDistanceAxis
    if (referenceAxis === null) {
      return null
    }

    let cameraParameters = this.props.solverResult.cameraParameters
    if (!cameraParameters) {
      return null
    }

    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    if (!imageWidth || !imageHeight) {
      return null
    }

    let referenceAxisVpIndex = Solver.vanishingPointIndexForAxis(
      referenceAxis,
      cameraParameters.vanishingPointAxes
    )
    let uIndex = (referenceAxisVpIndex + 1) % 3
    let vIndex = (referenceAxisVpIndex + 2) % 3

    let positionRel = this.props.controlPointsStateBase.referenceDistanceAnchor
    let position = CoordinatesUtil.convert(
      positionRel,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      imageWidth,
      imageHeight
    )

    let origin = CoordinatesUtil.convert(
      this.props.controlPointsStateBase.origin,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      imageWidth,
      imageHeight
    )

    let anchorPositionIsValid = MathUtil.pointsAreOnTheSameSideOfLine(
      cameraParameters.vanishingPoints[uIndex],
      cameraParameters.vanishingPoints[vIndex],
      origin,
      position
    )

    let uIntersection = this.imagePlane2Abs(
      MathUtil.lineIntersection(
        [origin, cameraParameters.vanishingPoints[uIndex]],
        [position, cameraParameters.vanishingPoints[vIndex]]
      )!
    )

    let vIntersection = this.imagePlane2Abs(
      MathUtil.lineIntersection(
        [origin, cameraParameters.vanishingPoints[vIndex]],
        [position, cameraParameters.vanishingPoints[uIndex]]
      )!
    )

    let posAbs = this.imagePlane2Abs(position)

    let originAbs = this.imagePlane2Abs(origin)

    // anchor point + length
    let referenceAxisVpRel = CoordinatesUtil.convert(
      cameraParameters.vanishingPoints[referenceAxisVpIndex],
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      imageWidth,
      imageHeight
    )

    let anchorToVpRel = MathUtil.normalized({
      x: referenceAxisVpRel.x - positionRel.x,
      y: referenceAxisVpRel.y - positionRel.y
    })

    let handlePositions = Solver.referenceDistanceHandlesRelativePositions(
      this.props.controlPointsStateBase,
      referenceAxis,
      cameraParameters.vanishingPoints,
      cameraParameters.vanishingPointAxes,
      imageWidth,
      imageHeight
    )

    return (
      <ReferenceDistanceControl
        referenceAxis={referenceAxis}
        origin={originAbs}
        horizonVanishingPoints={[
          this.imagePlane2Abs(cameraParameters.vanishingPoints[uIndex]),
          this.imagePlane2Abs(cameraParameters.vanishingPoints[vIndex])
        ]}
        uIntersection={uIntersection}
        vIntersection={vIntersection}
        anchorPositionIsValid={anchorPositionIsValid}
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
          this.didDragControlPoint(position)
          this.props.callbacks.onReferenceDistanceAnchorDrag(
            this.abs2RelPoint(position)
          )
        }}
        handleDragCallback={(handleIndex: number, dragPosition: Point2D) => {
          let dragRel = this.abs2RelPoint(dragPosition, false)
          let a = { x: dragRel.x - positionRel.x, y: dragRel.y - positionRel.y }
          let offset = MathUtil.dot(anchorToVpRel, a)
          this.didDragControlPoint(dragPosition, handleIndex)
          this.props.callbacks.onReferenceDistanceHandleDrag(
            handleIndex, offset
          )
        }}
      />
    )
  }

  private render1VPControlPoints() {
    let cameraParameters = this.props.solverResult.cameraParameters
    let secondVanishingPoint = cameraParameters ? cameraParameters.vanishingPoints[1] : null
    return (
      <Group>
        <HorizonControl
          vanishingPointIndex={1}
          vanishingPoint={secondVanishingPoint ? this.imagePlane2Abs(secondVanishingPoint) : null}
          color={this.vanishingPointColor(1)}
          pointPair={this.rel2AbsControlPointPairState(this.props.controlPointsState1VP.horizon)}
          dragCallback={(controlPointIndex: ControlPointPairIndex, position: Point2D) => {
            this.didDragControlPoint(position)
            this.props.callbacks.onHorizonDrag(
              controlPointIndex,
              this.abs2RelPoint(position)
            )
          }}
        />
        <PrincipalPointControl
          absolutePosition={this.rel2AbsPoint(this.props.controlPointsStateBase.principalPoint)}
          enabled={this.props.calbrationSettings1VP.principalPointMode == PrincipalPointMode1VP.Manual}
          visible={this.props.calbrationSettings1VP.principalPointMode == PrincipalPointMode1VP.Manual}
          dragCallback={(absolutePosition: Point2D) => {
            this.didDragControlPoint(absolutePosition)
            this.props.callbacks.onPrincipalPointDrag(
              this.abs2RelPoint(absolutePosition)
            )
          }}
        />
      </Group>
    )
  }

  private render2VPControlPoints() {

    let firstVanishingPointControlState = this.props.controlPointsStateBase.firstVanishingPoint
    let secondVanishingPointControlState = this.props.controlPointsState2VP.secondVanishingPoint
    if (this.props.calbrationSettings2VP.quadModeEnabled) {
      // quad mode is enabled. use the control point positions of the first vanishing point control
      secondVanishingPointControlState = {
        lineSegments: [
          [
            firstVanishingPointControlState.lineSegments[0][0],
            firstVanishingPointControlState.lineSegments[1][0]
          ],
          [
            firstVanishingPointControlState.lineSegments[0][1],
            firstVanishingPointControlState.lineSegments[1][1]
          ]
        ]
      }
    }

    return (
      <Group>
        <VanishingPointControl
          hideControlPoints={this.props.calbrationSettings2VP.quadModeEnabled}
          vanishingPointIndex={1}
          color={this.vanishingPointColor(1)}
          controlState={
            this.rel2AbsVanishingPointControlState(
              secondVanishingPointControlState
            )
          }
          vanishingPoint={this.vanishingPointAbs(1)}
          onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
            if (this.props.calbrationSettings2VP.quadModeEnabled) {
              // quad mode is enabled. don't allow dragging
            } else {
              this.didDragControlPoint(position)
              this.props.callbacks.onSecondVanishingPointControlPointDrag(
                lineSegmentIndex,
                pointPairIndex,
                this.abs2RelPoint(position)
              )
            }
          }}
        />
        {this.renderThirdVanishingPointControl()}
        {this.renderPrincipalPoint2VP()}
      </Group>
    )
  }

  private renderThirdVanishingPointControl() {
    if (this.props.calbrationSettings2VP.principalPointMode != PrincipalPointMode2VP.FromThirdVanishingPoint) {
      return null
    }

    return (
      <VanishingPointControl
        vanishingPointIndex={2}
        color={this.vanishingPointColor(2)}
        controlState={
          this.rel2AbsVanishingPointControlState(
            this.props.controlPointsState2VP.thirdVanishingPoint
          )
        }
        vanishingPoint={this.vanishingPointAbs(2)}
        onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
          this.didDragControlPoint(position)
          this.props.callbacks.onThirdVanishingPointControlPointDrag(
            lineSegmentIndex,
            pointPairIndex,
            this.abs2RelPoint(position)
          )
        }}
      />
    )
  }

  private renderPrincipalPoint2VP() {
    let cameraParameters = this.props.solverResult.cameraParameters
    let absolutePosition: Point2D | null = null
    switch (this.props.calbrationSettings2VP.principalPointMode) {
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        if (cameraParameters) {
          if (cameraParameters.principalPoint) {
            absolutePosition = this.imagePlane2Abs(cameraParameters.principalPoint)
          }
        }
        break
      case PrincipalPointMode2VP.Manual:
        absolutePosition = this.rel2AbsPoint(this.props.controlPointsStateBase.principalPoint)
        break
      default:
        break
    }

    if (!absolutePosition) {
      return null
    }

    return (
      <PrincipalPointControl
        absolutePosition={absolutePosition}
        enabled={this.props.calbrationSettings2VP.principalPointMode == PrincipalPointMode2VP.Manual}
        visible={this.props.calbrationSettings2VP.principalPointMode != PrincipalPointMode2VP.Default}
        dragCallback={(absolutePosition: Point2D) => {
          this.didDragControlPoint(absolutePosition)
          this.props.callbacks.onPrincipalPointDrag(
            this.abs2RelPoint(absolutePosition)
          )
        }}
      />
    )
  }

  private imageAbsoluteAABB(): AABB | null {
    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    let width = this.state.width
    let height = this.state.height

    if (!imageWidth || !imageHeight || !width || !height) {
      return null
    }

    if (height <= 0 || imageHeight <= 0) {
      return null
    }

    let pad = this.props.applyImagePadding ? 20 : 0
    let imageAspect = imageWidth / imageHeight
    let aspect = (width - 2 * pad) / (height - 2 * pad)
    let xOffset = pad
    let yOffset = pad
    let imageScale = 1
    if (imageAspect > aspect) {
      // wide image
      imageScale = (width - 2 * pad) / imageWidth
      yOffset = pad + 0.5 * (height - 2 * pad - imageScale * imageHeight)
    } else {
      // tall image
      imageScale = (height - 2 * pad) / imageHeight
      xOffset = pad + 0.5 * (width - 2 * pad - imageScale * imageWidth)
    }

    return {
      xMin: xOffset,
      yMin: yOffset,
      xMax: xOffset + imageScale * imageWidth,
      yMax: yOffset + imageScale * imageHeight
    }
  }

  private rel2AbsVanishingPointControlState(state: VanishingPointControlState): VanishingPointControlState {
    return {
      lineSegments: [
        this.rel2AbsControlPointPairState(state.lineSegments[0]),
        this.rel2AbsControlPointPairState(state.lineSegments[1])
      ]
    }
  }

  private rel2AbsControlPointPairState(rel: ControlPointPairState): ControlPointPairState {
    return [
      this.rel2AbsPoint(rel[0]),
      this.rel2AbsPoint(rel[1])
    ]
  }

  private rel2AbsPoint(point: Point2D): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    return {
      x: imageAABB.xMin + point.x * (imageAABB.xMax - imageAABB.xMin),
      y: imageAABB.yMin + point.y * (imageAABB.yMax - imageAABB.yMin)
    }
  }

  private clampedAbsPoint(point: Point2D): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    return {
      x: Math.min(Math.max(imageAABB.xMin, point.x), imageAABB.xMax),
      y: Math.min(Math.max(imageAABB.yMin, point.y), imageAABB.yMax)
    }
  }

  private abs2RelPoint(point: Point2D, clamp: boolean = true): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    let relativePosition = {
      x: (point.x - imageAABB.xMin) / (imageAABB.xMax - imageAABB.xMin),
      y: (point.y - imageAABB.yMin) / (imageAABB.yMax - imageAABB.yMin)
    }

    // clamp to [0,1] x [0,1]
    if (clamp) {
      relativePosition.x = Math.min(1, Math.max(0, relativePosition.x))
      relativePosition.y = Math.min(1, Math.max(0, relativePosition.y))
    }

    return relativePosition
  }

  private imagePlane2Abs(imagePlanePosition: Point2D): Point2D {
    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    if (!imageWidth || !imageHeight) {
      return { x: 0, y: 0 }
    }
    let realtivePos = CoordinatesUtil.convert(
      imagePlanePosition,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      imageWidth,
      imageHeight
    )
    return this.rel2AbsPoint(realtivePos)
  }

  private vanishingPointAbs(vanishingPointIndex: number): Point2D | null {
    let cameraParameters = this.props.solverResult.cameraParameters
    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    if (cameraParameters && imageWidth && imageHeight) {
      let imagePlanePos = cameraParameters.vanishingPoints[vanishingPointIndex]
      return this.imagePlane2Abs(imagePlanePos)
    }
    return null
  }

  private vanishingPointColor(vanishingPointIndex: number): string {
    let firstAxisColor = Palette.colorForAxis(
      this.props.calibrationSettingsBase.firstVanishingPointAxis
    )
    let secondAxisColor = Palette.colorForAxis(
      this.props.calibrationSettingsBase.secondVanishingPointAxis
    )
    switch (vanishingPointIndex) {
      case 0:
        return firstAxisColor
      case 1:
        return secondAxisColor
    }

    let axisColors = [
      Palette.colorForAxis(Axis.PositiveX),
      Palette.colorForAxis(Axis.PositiveY),
      Palette.colorForAxis(Axis.PositiveZ)
    ]

    for (let axisColor of axisColors) {
      if ([firstAxisColor, secondAxisColor].indexOf(axisColor) < 0) {
        return axisColor
      }
    }

    // should't end up here
    return firstAxisColor
  }
}
