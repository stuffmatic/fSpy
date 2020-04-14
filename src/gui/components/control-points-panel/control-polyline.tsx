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
          dash={this.props.dashed ? [2, 3] : undefined}
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

    // Hacky offset for the 1 digit
    const xOffset = this.props.number == 1 ? -1 : 0

    return numberGlyph(
      this.props.number,
      Palette.white,
      { x: x + xOffset, y: y },
      7
    )
  }
}
