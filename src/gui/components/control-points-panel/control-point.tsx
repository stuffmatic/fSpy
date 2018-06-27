import * as React from 'react'
import Point2D from '../../solver/point-2d'
import { Circle, Group } from 'react-konva'
import ControlPolyline from './control-polyline'
import MathUtil from '../../solver/math-util'

interface ControlPointProps {
  hidden?: boolean
  absolutePosition: Point2D
  fill?: string | undefined
  stroke?: string | undefined
  isDragDisabled?: boolean
  lineNormal?: Point2D // TODO: less cryptic API to draw line control points
  onControlPointDrag(absolutePosition: Point2D): void
}

interface ControlPointState {
  isDragging: boolean
}

export default class ControlPoint extends React.Component<ControlPointProps, ControlPointState> {

  readonly HIT_RADIUS = 8
  readonly RADIUS = 4

  constructor(props: ControlPointProps) {
    super(props)

    this.state = {
      isDragging: false
    }
  }

  render() {
    if (this.props.hidden) {
      return null
    }

    return (
      <Group>
        <Circle
          draggable={!this.props.isDragDisabled}
          radius={this.HIT_RADIUS}
          x={this.props.absolutePosition.x}
          y={this.props.absolutePosition.y}
          onDragStart={(event: any) => {
            this.setState({
              ...this.state,
              isDragging: true
            })
            this.handleDrag(event)
          }}
          onDragMove={(event: any) => this.handleDrag(event)}
          onDragEnd={(event: any) => {
            this.setState({
              ...this.state,
              isDragging: false
            })
            this.handleDrag(event)
          }}
        />
        {this.renderVisualRepresentation()}
      </Group>
    )
  }

  private renderVisualRepresentation() {
    let normal = this.props.lineNormal
    if (normal) {
      normal = MathUtil.normalized(normal)
      let width = 6
      return (
        <ControlPolyline
          color={this.props.stroke}
          points={[
            {
              x: this.props.absolutePosition.x + width * normal.x,
              y: this.props.absolutePosition.y + width * normal.y
            },
            {
              x: this.props.absolutePosition.x - width * normal.x,
              y: this.props.absolutePosition.y - width * normal.y
            }
          ]}
        />
      )
    } else {
      return (
        <Circle
          listening={false}
          radius={this.state.isDragging ? 2 : this.RADIUS}
          strokeWidth={1.5}
          fill={this.props.fill}
          stroke={this.props.stroke}
          x={this.props.absolutePosition.x}
          y={this.props.absolutePosition.y}
        />
      )
    }
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
