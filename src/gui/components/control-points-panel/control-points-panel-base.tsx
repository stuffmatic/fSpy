import * as React from 'react'
import { Image as KonvaImage, Stage, Layer } from 'react-konva'
import Measure, { ContentRect } from 'react-measure'
import Point2D from '../../solver/point-2d'
import { ImageState } from '../../types/image-state'
import AABB from '../../solver/aabb'
import { ControlPointsContainerCallbacks } from '../../containers/control-points-container'
import OriginControl from '../../components/control-points-panel/origin-control'
import { ControlPointsStateBase } from '../../types/control-points-state'
import { GlobalSettings } from '../../types/global-settings'

interface ControlPointsPanelBaseState {
  width: number | undefined
  height: number | undefined
  relativePositionTest: Point2D
}

export interface ControlPointsPanelBaseProps {
  globalSettings: GlobalSettings
  imageState: ImageState
  callbacks: ControlPointsContainerCallbacks
  controlPointsState: ControlPointsStateBase
}

export default class ControlPointsPanelBase extends React.Component<ControlPointsPanelBaseProps, ControlPointsPanelBaseState> {

  private previousImageUrl: string | null
  private imageElement: HTMLImageElement | null
  private readonly pad = 20

  constructor(props: ControlPointsPanelBaseProps) {
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

  protected renderImage() {
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

  protected renderCommonControlPoints() {
    return (
      <OriginControl
        absolutePosition={this.rel2abs(this.props.controlPointsState.origin)}
        dragCallback={(absolutePosition: Point2D) => {
          let relativePosition = this.abs2Rel(absolutePosition)
          relativePosition.x = Math.min(1, Math.max(0, relativePosition.x))
          relativePosition.y = Math.min(1, Math.max(0, relativePosition.y))
          this.props.callbacks.onOriginDrag(
            this.props.globalSettings.calibrationMode,
            relativePosition
          )
        }}
      />
    )
  }

  protected imageAbsoluteAABB(): AABB | null {
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

  protected rel2abs(point: Point2D): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    return {
      x: imageAABB.xMin + point.x * (imageAABB.xMax - imageAABB.xMin),
      y: imageAABB.yMin + point.y * (imageAABB.yMax - imageAABB.yMin)
    }
  }

  protected abs2Rel(point: Point2D): Point2D {
    let imageAABB = this.imageAbsoluteAABB()
    if (!imageAABB) {
      return { x: 0, y: 0 }
    }

    return {
      x: (point.x - imageAABB.xMin) / (imageAABB.xMax - imageAABB.xMin),
      y: (point.y - imageAABB.yMin) / (imageAABB.yMax - imageAABB.yMin)
    }
  }
}
