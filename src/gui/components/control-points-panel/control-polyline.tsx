import * as React from 'react'
import { Circle, Group, Line } from 'react-konva'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'
import { numberGlyph } from './glyph-paths'

interface ControlPolylineProps {
  points: Point2D[]
  number?: number
  color?: string
  dimmed?: boolean
  dashed?: boolean
}

export default class ControlPolyline extends React.PureComponent<ControlPolylineProps> {
  render() {

    let coords: number[] = []
    let xMean = 0
    let yMean = 0
    for (let point of this.props.points) {
      xMean += (point.x / this.props.points.length)
      yMean += (point.y / this.props.points.length)
      coords.push(point.x)
      coords.push(point.y)
    }

    return (
      <Group>
        <Line points={coords}
          listening={false}
          stroke={this.props.color}
          strokeWidth={1}
          opacity={this.props.dimmed ? 0.35 : 1}
          dash={this.props.dashed ? [3, 6] : undefined}
        />
        {this.renderNumberCircle(xMean, yMean)}
        {this.renderNumber(xMean, yMean)}
      </Group>
    )
  }

  private renderNumberCircle(x: number, y: number) {
    if (this.props.number === undefined) {
      return null
    }

    return (
      <Circle
        listening={false}
        x={x}
        y={y}
        radius={7}
        fill={Palette.black}
        opacity={0.4}
      />
    )
  }

  private renderNumber(x: number, y: number) {
    if (this.props.number === undefined) {
      return null
    }

    return numberGlyph(
      this.props.number,
      Palette.white,
      { x: x, y: y },
      7
    )
  }
}
