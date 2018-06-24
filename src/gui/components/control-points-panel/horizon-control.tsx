import * as React from 'react'
import ControlPolyline from './control-polyline'
import ControlPoint from './control-point'
import { Group } from 'react-konva'
import { ControlPointPairState, ControlPointPairIndex } from '../../types/control-points-state'
import Point2D from '../../solver/point-2d'
import MathUtil from '../../solver/math-util'

interface HorizonControlProps {
  vanishingPointIndex: number
  color: string
  pointPair: ControlPointPairState
  vanishingPoint: Point2D | null
  dragCallback(controlPointIndex: ControlPointPairIndex, position: Point2D): void
}

export default class HorizonControl extends React.PureComponent<HorizonControlProps> {
  render() {
    return (
      <Group>
        {this.renderVanishingPoint()}
        <ControlPolyline
          number={this.props.vanishingPointIndex + 1}
          points={this.props.pointPair}
          color={this.props.color}
        />
        <ControlPoint
          absolutePosition={this.props.pointPair[0]}
          onControlPointDrag={(position: Point2D) => {
            this.props.dragCallback(ControlPointPairIndex.First, position)
          }}
          fill={this.props.color}
        />
        <ControlPoint
          absolutePosition={this.props.pointPair[1]}
          onControlPointDrag={(position: Point2D) => {
            this.props.dragCallback(ControlPointPairIndex.Second, position)
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

    return (
      <ControlPolyline
        dimmed={true}
        color={this.props.color}
        points={[
          this.props.vanishingPoint,
          MathUtil.lineSegmentMidpoint(
            this.props.pointPair
          )
        ]}
      />
    )
  }
}
