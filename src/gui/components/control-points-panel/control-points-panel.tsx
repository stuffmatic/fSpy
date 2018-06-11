import * as React from 'react'
import { Image as KonvaImage, Stage, Layer, Group } from 'react-konva'
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
              <Stage width={width} height={height}>
                <Layer>
                  {this.renderImage()}
                  {this.renderCommonControlPoints()}
                  {is1VPMode ? this.render1VPControlPoints() : this.render2VPControlPoints()}
                </Layer>
              </Stage>
            </div>
            )
          }
          }
        </Measure>
      </div>
    )
  }

  private renderImage() {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB || !this.imageElement) {
      return null
    }

    return (
      <KonvaImage
        opacity={this.props.globalSettings.imageOpacity}
        image={this.imageElement}
        x={imageAABB.xMin}
        y={imageAABB.yMin}
        width={imageAABB.xMax - imageAABB.xMin}
        height={imageAABB.yMax - imageAABB.yMin}
      />
    )
  }

  private renderCommonControlPoints() {
    return (
      <Group>
        <VanishingPointControl
          color={Palette.red}
          controlState={
            this.rel2AbsVanishingPointControlState(
              this.props.controlPointsStateBase.firstVanishingPoint
            )
          }
          vanishingPoint={null}
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
    return null
  }

  private render1VPControlPoints() {
    return (
      <Group>
        <HorizonControl
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
          dragCallback={ (absolutePosition: Point2D) => {
            this.props.callbacks.onPrincipalPointDrag(
              this.abs2RelPoint(absolutePosition)
            )
          }}
        />
      </Group>
    )
  }

  private render2VPControlPoints() {
    return (
      <Group>
        <VanishingPointControl
          color={Palette.green}
          controlState={
            this.rel2AbsVanishingPointControlState(
              this.props.controlPointsState2VP.secondVanishingPoint
            )
          }
          vanishingPoint={null}
          onControlPointDrag={(lineSegmentIndex: number, pointPairIndex: number, position: Point2D) => {
            this.props.callbacks.onSecondVanishingPointControlPointDrag(
              lineSegmentIndex,
              pointPairIndex,
              this.abs2RelPoint(position)
            )
          }}
        />
        {this.renderThirdVanishingPointControl()}
        <PrincipalPointControl
          absolutePosition={this.rel2AbsPoint(this.props.controlPointsStateBase.principalPoint)}
          enabled={this.props.calbrationSettings2VP.principalPointMode == PrincipalPointMode2VP.Manual}
          visible={this.props.calbrationSettings2VP.principalPointMode != PrincipalPointMode2VP.Default}
          dragCallback={ (absolutePosition: Point2D) => {
            this.props.callbacks.onPrincipalPointDrag(
              this.abs2RelPoint(absolutePosition)
            )
          }}
        />
      </Group>
    )
  }

  private renderThirdVanishingPointControl() {
    if (this.props.calbrationSettings2VP.principalPointMode != PrincipalPointMode2VP.FromThirdVanishingPoint) {
      return null
    }

    return (
      <VanishingPointControl
        color={Palette.orange}
        controlState={
          this.rel2AbsVanishingPointControlState(
            this.props.controlPointsState2VP.thirdVanishingPoint
          )
        }
        vanishingPoint={null}
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
}
