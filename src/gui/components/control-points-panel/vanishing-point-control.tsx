import * as React from 'react'
import ControlPolyline from './control-polyline'
import ControlPoint from './control-point'
import { Circle, Group } from 'react-konva'
import { VanishingPointControlState } from '../../types/control-points-state'
import Point2D from '../../solver/point-2d'
import MathUtil from '../../solver/math-util'
import { numberGlyph } from './glyph-paths'
import { Palette } from '../../style/palette'

interface VanishingPointControlProps {
  color: string
  vanishingPointColor: string | null
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
    let labelPosition = MathUtil.lineSegmentMidpoint(this.props.controlState.lineSegments[index])
    return (
      <Group>
        <ControlPolyline
          points={this.props.controlState.lineSegments[index]}
          color={this.props.color}
        />
        <ControlPoint
          absolutePosition={this.props.controlState.lineSegments[index][0]}
          onControlPointDrag={(position: Point2D) => {
            this.props.onControlPointDrag(index, 0, position)
          }}
          fill={this.props.color}
        />
        <ControlPoint
          absolutePosition={this.props.controlState.lineSegments[index][1]}
          onControlPointDrag={(position: Point2D) => {
            this.props.onControlPointDrag(index, 1, position)
          }}
          fill={this.props.color}
        />
        <Circle
          x={labelPosition.x}
          y={labelPosition.y}
          radius={6}
          fill={Palette.black}
          opacity={0.4}
        />
        {
          numberGlyph(
            this.props.vanishingPointIndex + 1,
            Palette.white,
            labelPosition,
            6
          )
        }
      </Group>
    )
  }

  private renderVanishingPoint() {
    if (!this.props.vanishingPoint || !this.props.vanishingPointColor) {
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
        color={this.props.vanishingPointColor}
        dimmed={true}
        points={[p1, p2, p3]}
      />
    )
  }
}
