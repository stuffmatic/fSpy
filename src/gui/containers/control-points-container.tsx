import * as React from 'react'
import { Image as KonvaImage, Stage, Layer, Rect, Circle } from 'react-konva'
import Measure, { ContentRect } from 'react-measure'
import { Palette } from '../style/palette'
import Point2D from '../solver/point-2d'
import { ImageState } from '../types/image-state'

interface ControlPointProps {
  absolutePosition: Point2D
  onControlPointDrag(absolutePosition: Point2D): void
}

class ControlPoint extends React.Component<ControlPointProps> {
  constructor(props: ControlPointProps) {
    super(props)
  }

  render() {
    return (
      <Circle
        draggable
        radius={4}
        fill={Palette.blue}
        x={this.props.absolutePosition.x}
        y={this.props.absolutePosition.y}
        onDragStart={(event: any) => this.handleDrag(event)}
        onDragMove={(event: any) => this.handleDrag(event)}
        onDragEnd={(event: any) => this.handleDrag(event)}
      />
    )
  }

  private handleDrag(event: any) {
    this.props.onControlPointDrag(
      {
        x: event.target.x(),
        y: event.target.y()
      }
    )
  }
}

interface ControlPointsContainerState {
  width: number | undefined
  height: number | undefined
  relativePositionTest: Point2D
}

interface ControlPointsContainerProps {
  imageState: ImageState
}

export default class ControlPointsContainer extends React.Component<ControlPointsContainerProps, ControlPointsContainerState> {

  private previousImageUrl: string | null
  private imageElement: HTMLImageElement | null

  constructor(props: ControlPointsContainerProps) {
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
                  <Rect
                    x={20}
                    y={20}
                    width={width! - 2 * 20}
                    height={height! - 2 * 20}
                    stroke={Palette.red}
                  />
                  {this.renderImage()}
                  <ControlPoint
                    absolutePosition={this.rel2abs(this.state.relativePositionTest)}
                    onControlPointDrag={(absolutePosition: Point2D) => {
                      let relativePosition = this.abs2Rel(absolutePosition)
                      relativePosition.x = Math.min(Math.max(0.1, relativePosition.x), 0.9)
                      relativePosition.y = Math.min(Math.max(0.1, relativePosition.y), 0.9)
                      this.setState({
                        ...this.state,
                        relativePositionTest: relativePosition
                      })
                    }}
                  />
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
    if (!this.imageElement) {
      return null
    }

    let width = this.state.width
    let height = this.state.height

    return (
      <KonvaImage
        image={this.imageElement}
        x={20}
        y={20}
        width={width! - 2 * 20}
        height={height! - 2 * 20}
      />
    )
  }

  private rel2abs(point: Point2D): Point2D {
    if (this.state.width === undefined || this.state.height === undefined) {
      return {
        x: 0, y: 0
      }
    }
    return {
      x: this.state.width * point.x,
      y: this.state.height * point.y
    }
  }

  private abs2Rel(point: Point2D): Point2D {
    if (this.state.width === undefined || this.state.height === undefined) {
      return {
        x: 0, y: 0
      }
    }
    return {
      x: point.x / this.state.width,
      y: point.y / this.state.height
    }
  }
}
