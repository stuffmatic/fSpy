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
import { CalibrationSettings1VP, CalibrationSettingsBase, CalibrationSettings2VP, HorizonMode, PrincipalPointMode2VP, PrincipalPointMode1VP } from '../../types/calibration-settings'
import PrincipalPointControl from './principal-point-control'
import { SolverResult } from '../../solver/solver-result'
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util'
import Overlay3DPanel from './overlay-3d-panel'
import ReferenceDistanceControl from './reference-distance-control'
import Solver from '../../solver/solver'
import MathUtil from '../../solver/math-util'
import AABBOps from '../../solver/aabb-ops'

interface ControlPointsPanelState {
  width: number | undefined
  height: number | undefined
  relativePositionTest: Point2D
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
}

export default class ControlPointsPanel extends React.Component<ControlPointsPanelProps, ControlPointsPanelState> {

  private previousImageUrl: string | null
  private imageElement: HTMLImageElement | null
  private readonly pad = 20

  constructor(props: ControlPointsPanelProps) {
    super(props)

    this.previousImageUrl = null
    this.imageElement = null

    this.state = {
      width: undefined,
      height: undefined,
      relativePositionTest: {
        x: 0.5, y: 0.5
      }
    }
  }

  render() {
    let width = this.state.width
    let height = this.state.height

    if (this.previousImageUrl != this.props.imageState.url) {
      if (this.props.imageState.url) {
        this.imageElement = new Image()
        this.imageElement.src = this.props.imageState.url
      } else {
        this.imageElement = null
      }
    }
    this.previousImageUrl = this.props.imageState.url

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
              {hasImage ? this.renderImageAndControlPoints(width, height, is1VPMode) : this.renderPlaceholder()}
            </div>
            )
          }
          }
        </Measure>
      </div>
    )
  }

  private renderPlaceholder() {
    return (
      <div>
        Drag an image or project onto this area.
        <button onClick={(_: any) => { this.props.callbacks.onLoadExampleProject() }}>
          Load example project
        </button>
      </div>
    )
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
      </div>
    )
  }

  private render3DOverlay() {
    let imageAABB = this.imageAbsoluteAABB()

    if (!imageAABB || !this.state.width || !this.state.height) {
      return null
    }
    return (
      <Overlay3DPanel
        imageAABB={imageAABB}
        width={this.state.width}
        height={this.state.height}
        solverResult={this.props.solverResult}
        globalSettings={this.props.globalSettings}
      />
    )

  }

  private renderImage() {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB || !this.imageElement) {
      return null
    }

    return (
      <img
        style={{
          position: 'absolute',
          left: imageAABB.xMin,
          top: imageAABB.yMin
        }}
        src={this.props.imageState.url!}
        width={AABBOps.width(imageAABB)}
        height={AABBOps.height(imageAABB)}
      />
    )

    /*return (
      <KonvaImage
        opacity={this.props.globalSettings.imageOpacity}
        image={this.imageElement}
        x={imageAABB.xMin}
        y={imageAABB.yMin}
        width={imageAABB.xMax - imageAABB.xMin}
        height={imageAABB.yMax - imageAABB.yMin}
      />
    )*/
  }

  private renderCommonControlPoints() {
    return (
      <Group>
        <VanishingPointControl
          vanishingPointIndex={0}
          color={
            Palette.colorForAxis(this.props.calibrationSettingsBase.firstVanishingPointAxis)
          }
          vanishingPointColor={this.vanishingPointColor(0)}
          controlState={
            this.rel2AbsVanishingPointControlState(
              this.props.controlPointsStateBase.firstVanishingPoint
            )
          }
          vanishingPoint={this.vanishingPointAbs(0)}
          onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
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

    let result = this.props.solverResult
    if (!result.vanishingPoints || !result.vanishingPointAxes) {
      return null
    }

    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    if (!imageWidth || !imageHeight) {
      return null
    }

    let referenceAxisVpIndex = Solver.vanishingPointIndexForAxis(
      referenceAxis,
      result.vanishingPointAxes
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

    let uIntersection = this.imagePlane2Abs(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[uIndex]],
        [position, result.vanishingPoints[vIndex]]
      )!
    )

    let vIntersection = this.imagePlane2Abs(
      MathUtil.lineIntersection(
        [origin, result.vanishingPoints[vIndex]],
        [position, result.vanishingPoints[uIndex]]
      )!
    )

    let posAbs = this.imagePlane2Abs(position)

    let originAbs = this.imagePlane2Abs(origin)

    // anchor point + length
    let referenceAxisVpRel = CoordinatesUtil.convert(
      result.vanishingPoints[referenceAxisVpIndex],
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
      result.vanishingPoints,
      result.vanishingPointAxes,
      imageWidth,
      imageHeight
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
          this.props.callbacks.onReferenceDistanceAnchorDrag(
            this.abs2RelPoint(position)
          )
        }}
        handleDragCallback={(handleIndex: number, dragPosition: Point2D) => {
          let dragRel = this.abs2RelPoint(dragPosition)
          let a = { x: dragRel.x - positionRel.x, y: dragRel.y - positionRel.y }
          let offset = MathUtil.dot(anchorToVpRel, a)
          this.props.callbacks.onReferenceDistanceHandleDrag(
            handleIndex, offset
          )
        }}
      />
    )
  }

  private render1VPControlPoints() {
    let secondVanishingPoint = this.props.solverResult.vanishingPoints ? this.props.solverResult.vanishingPoints[1] : null
    return (
      <Group>
        <HorizonControl
          vanishingPoint={secondVanishingPoint ? this.imagePlane2Abs(secondVanishingPoint) : null}
          vanishingPointColor={this.vanishingPointColor(1)}
          enabled={this.props.calbrationSettings1VP.horizonMode == HorizonMode.Manual}
          pointPair={this.rel2AbsControlPointPairState(this.props.controlPointsState1VP.horizon)}
          dragCallback={(controlPointIndex: ControlPointPairIndex, position: Point2D) => {
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
          vanishingPointIndex={1}
          color={
            Palette.colorForAxis(this.props.calibrationSettingsBase.secondVanishingPointAxis)
          }
          vanishingPointColor={this.vanishingPointColor(1)}
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
        color={Palette.orange}
        vanishingPointColor={this.vanishingPointColor(2)}
        controlState={
          this.rel2AbsVanishingPointControlState(
            this.props.controlPointsState2VP.thirdVanishingPoint
          )
        }
        vanishingPoint={this.vanishingPointAbs(2)}
        onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
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
    let absolutePosition: Point2D | null = null
    switch (this.props.calbrationSettings2VP.principalPointMode) {
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        if (this.props.solverResult.principalPoint) {
          absolutePosition = this.imagePlane2Abs(this.props.solverResult.principalPoint)
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

    if (!this.imageElement || !imageWidth || !imageHeight || !width || !height) {
      return null
    }

    if (height <= 0 || imageHeight <= 0) {
      return null
    }

    let pad = this.pad
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

  private abs2RelPoint(point: Point2D): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    let relativePosition = {
      x: (point.x - imageAABB.xMin) / (imageAABB.xMax - imageAABB.xMin),
      y: (point.y - imageAABB.yMin) / (imageAABB.yMax - imageAABB.yMin)
    }

    // clamp to [0,1] x [0,1]
    relativePosition.x = Math.min(1, Math.max(0, relativePosition.x))
    relativePosition.y = Math.min(1, Math.max(0, relativePosition.y))

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
    let imageWidth = this.props.imageState.width
    let imageHeight = this.props.imageState.height
    if (this.props.solverResult.vanishingPoints && imageWidth && imageHeight) {
      let imagePlanePos = this.props.solverResult.vanishingPoints[vanishingPointIndex]
      return this.imagePlane2Abs(imagePlanePos)
    }
    return null
  }

  private vanishingPointColor(vanishingPointIndex: number): string | null {
    if (!this.props.solverResult.vanishingPointAxes) {
      return null
    }

    return Palette.colorForAxis(
      this.props.solverResult.vanishingPointAxes[vanishingPointIndex]
    )
  }
}
