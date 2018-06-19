import * as React from 'react'
import Point2D from '../../solver/point-2d'
import { Circle, Group, Line } from 'react-konva'
import { Palette } from '../../style/palette'

interface ControlPointProps {
  absolutePosition: Point2D
  fill?: string | undefined
  stroke?: string | undefined
  isDragDisabled?: boolean
  number?: number // 1 or 2
  onControlPointDrag(absolutePosition: Point2D): void
}

export default class ControlPoint extends React.Component<ControlPointProps> {

  readonly RADIUS = 6

  constructor(props: ControlPointProps) {
    super(props)
  }

  render() {
    return (
      <Group>
        <Circle
          draggable={!this.props.isDragDisabled}
          radius={this.RADIUS}
          strokeWidth={1.5}
          fill={this.props.fill}
          stroke={this.props.stroke}
          x={this.props.absolutePosition.x}
          y={this.props.absolutePosition.y}
          onDragStart={(event: any) => this.handleDrag(event)}
          onDragMove={(event: any) => this.handleDrag(event)}
          onDragEnd={(event: any) => this.handleDrag(event)}
        />
        <Line
          listening={false}
          points={this.figureControlPoints()}
          stroke={Palette.white}
          strokeWidth={1.5}
        />

      </Group>
    )
  }

  private figureControlPoints(): number[] {
    if (!this.props.number) {
      return []
    }

    let coords: Point2D[] = []

    switch (this.props.number) {
      case 1: {
        coords = [
          {
            x: this.props.absolutePosition.x - 0.4 * this.RADIUS,
            y: this.props.absolutePosition.y - 0.3 * this.RADIUS
          },
          {
            x: this.props.absolutePosition.x,
            y: this.props.absolutePosition.y - 0.5 * this.RADIUS
          },
          {
            x: this.props.absolutePosition.x,
            y: this.props.absolutePosition.y + 0.6 * this.RADIUS
          }
        ]
        break
      }
      case 2: {
        break
      }
      case 3: {
        break
      }
      default:
        break
    }

    let result: number[] = []

    for (let coord of coords) {
      result.push(coord.x)
      result.push(coord.y)
    }
    return result
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
