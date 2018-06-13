import * as React from 'react'
import ControlPolyline from './control-polyline'
import ControlPoint from './control-point'
import { Group } from 'react-konva'
import { ControlPointPairState, ControlPointPairIndex } from '../../types/control-points-state'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'
import MathUtil from '../../solver/math-util'

interface HorizonControlProps {
  enabled: boolean
  pointPair: ControlPointPairState
  vanishingPoint: Point2D | null
  vanishingPointColor: string | null
  dragCallback(controlPointIndex: ControlPointPairIndex, position: Point2D): void
}

export default class HorizonControl extends React.PureComponent<HorizonControlProps> {
  render() {
    if (!this.props.enabled) {
      return null
    }

    return (
      <Group>
        {this.renderVanishingPoint()}
        <ControlPolyline
          points={this.props.pointPair}
          color={Palette.yellow}
        />
        <ControlPoint
          absolutePosition={this.props.pointPair[0]}
          onControlPointDrag={(position: Point2D) => {
            if (this.props.enabled) {
              this.props.dragCallback(ControlPointPairIndex.First, position)
            }
          }}
          fill={Palette.yellow}
        />
        <ControlPoint
          absolutePosition={this.props.pointPair[1]}
          onControlPointDrag={(position: Point2D) => {
            if (this.props.enabled) {
              this.props.dragCallback(ControlPointPairIndex.Second, position)
            }
          }}
          fill={Palette.yellow}
        />
      </Group>
    )
  }

  private renderVanishingPoint() {
    if (!this.props.vanishingPoint || !this.props.vanishingPointColor) {
      return null
    }

    return (
      <ControlPolyline
        dimmed={true}
        color={this.props.vanishingPointColor}
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
