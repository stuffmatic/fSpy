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
import ControlPolyline from './control-polyline'
import ControlPoint from './control-point'
import { Group } from 'react-konva'
import { VanishingPointControlState } from '../../types/control-points-state'
import Point2D from '../../solver/point-2d'
import MathUtil from '../../solver/math-util'

interface VanishingPointControlProps {
  hideControlPoints?: boolean
  color: string
  controlState: VanishingPointControlState
  vanishingPoint: Point2D | null
  vanishingPointIndex: number

  onControlPointDrag(
    lineSegmentIndex: number,
    pointPairIndex: number,
    position: Point2D
  ): void
}

export default class VanishingPointControl extends React.PureComponent<VanishingPointControlProps> {
  render() {
    return (
      <Group>
        {this.renderVanishingPoint()}
        {this.renderLineSegment(0)}
        {this.renderLineSegment(1)}
      </Group>
    )
  }

  private renderLineSegment(index: number) {
    return (
      <Group>
        <ControlPolyline
          number={this.props.vanishingPointIndex + 1}
          points={this.props.controlState.lineSegments[index]}
          color={this.props.color}
        />
        <ControlPoint
          hidden={this.props.hideControlPoints}
          absolutePosition={this.props.controlState.lineSegments[index][0]}
          onControlPointDrag={(position: Point2D) => {
            this.props.onControlPointDrag(index, 0, position)
          }}
          fill={this.props.color}
        />
        <ControlPoint
          hidden={this.props.hideControlPoints}
          absolutePosition={this.props.controlState.lineSegments[index][1]}
          onControlPointDrag={(position: Point2D) => {
            this.props.onControlPointDrag(index, 1, position)
          }}
          fill={this.props.color}
        />
      </Group>
    )
  }

  private renderVanishingPoint() {
    if (!this.props.vanishingPoint) {
      return null
    }

    let p1 = MathUtil.lineSegmentMidpoint(
      this.props.controlState.lineSegments[0]
    )
    let p2 = this.props.vanishingPoint
    let p3 = MathUtil.lineSegmentMidpoint(
      this.props.controlState.lineSegments[1]
    )
    return (
      <ControlPolyline
        color={this.props.color}
        dimmed={true}
        points={[p1, p2, p3]}
      />
    )
  }
}
