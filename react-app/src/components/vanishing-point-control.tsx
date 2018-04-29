import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { VanishingPointControlState, Point2D } from '../types/control-points-state';
import MathUtil from '../solver/math-util';

interface VanishingPointControlProps {
  color: string
  vanishingPointIndex: number
  controlState: VanishingPointControlState
  vanishingPointPosition: Point2D | null

  onControlPointDrag(
    vanishingPointIndex: number,
    vanishingLineIndex: number,
    pointPairIndex: number,
    position: Point2D
  ): void
}

export default class VanishingPointControl extends React.PureComponent<VanishingPointControlProps> {
  render() {
    //TODO: two nested for loops?
    return (
      <g>
        <ControlLine
          start={this.props.controlState.vanishingLines[0][0]}
          end={this.props.controlState.vanishingLines[0][1]}
          color={this.props.color}
        />
        <ControlPoint
          position={this.props.controlState.vanishingLines[0][0]}
          dragCallback={(position: Point2D) => {
            this.props.onControlPointDrag(this.props.vanishingPointIndex, 0, 0, position)
          }}
          fill={this.props.color}
        />
        <ControlPoint
          position={this.props.controlState.vanishingLines[0][1]}
          dragCallback={(position: Point2D) => {
            this.props.onControlPointDrag(this.props.vanishingPointIndex, 0, 1, position)
          }}
          fill={this.props.color}
        />
        <ControlLine
          start={this.props.controlState.vanishingLines[1][0]}
          end={this.props.controlState.vanishingLines[1][1]}
          color={this.props.color}
        />
        <ControlPoint
          position={this.props.controlState.vanishingLines[1][0]}
          dragCallback={(position: Point2D) => {
            this.props.onControlPointDrag(this.props.vanishingPointIndex, 1, 0, position)
          }}
          fill={this.props.color}
        />
        <ControlPoint
          position={this.props.controlState.vanishingLines[1][1]}
          dragCallback={(position: Point2D) => {
            this.props.onControlPointDrag(this.props.vanishingPointIndex, 1, 1, position)
          }}
          fill={this.props.color}
        />
        { this.renderVanishingPoint() }

      </g>
    )
  }

  private renderVanishingPoint() {
    if (this.props.vanishingPointPosition) {
      let p1 = MathUtil.lineSegmentMidpoint(
        this.props.controlState.vanishingLines[0]
      )
      let p2 = this.props.vanishingPointPosition
      let p3 = MathUtil.lineSegmentMidpoint(
        this.props.controlState.vanishingLines[1]
      )
      return (
        <polyline
          points={ p1.x + ", " + p1.y + " " + p2.x + ", " + p2.y + " " + p3.x + ", " + p3.y }
          fill="none"
          stroke={this.props.color}
          strokeWidth={0.5}
        />
      )
    }

    return null
  }
}