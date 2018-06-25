import * as React from 'react'
import ControlPoint from './control-point'
import ReferenceDistanceAnchorControl from './reference-distance-anchor-control'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'
import { Group } from 'react-konva'
import ControlPolyline from './control-polyline'
import MathUtil from '../../solver/math-util'

export const dashedRulerStyle = { stroke: Palette.gray, opacity: 0.5, strokeDasharray: '2,6' }

interface ReferenceDistanceControlProps {
  anchorPosition: Point2D
  handlePositions: [Point2D, Point2D]
  horizonVanishingPoints: [Point2D, Point2D]
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  anchorPositionIsValid: boolean
  anchorDragCallback(position: Point2D): void
  handleDragCallback(handleIndex: number, offset: Point2D): void
}

export default class ReferenceDistanceControl extends React.PureComponent<ReferenceDistanceControlProps> {

  render() {
    let horizonDir = MathUtil.normalized(
      MathUtil.difference(
        this.props.horizonVanishingPoints[0],
        this.props.horizonVanishingPoints[1]
      )
    )

    let l = 10000
    let horizonLineStart = {
      x: this.props.horizonVanishingPoints[0].x - l * horizonDir.x,
      y: this.props.horizonVanishingPoints[0].y - l * horizonDir.y
    }
    let horizonLineEnd = {
      x: this.props.horizonVanishingPoints[0].x + l * horizonDir.x,
      y: this.props.horizonVanishingPoints[0].y + l * horizonDir.y
    }

    return (
      <Group>
        <ControlPolyline
          points={[
            horizonLineStart,
            horizonLineEnd
          ]}
          color={Palette.referenceDistanceControlColor}
          dimmed={true}
        />
        <ReferenceDistanceAnchorControl
          anchorPositionIsValid={this.props.anchorPositionIsValid}
          absolutePosition={this.props.anchorPosition}
          dragCallback={this.props.anchorDragCallback}
          uIntersection={this.props.uIntersection}
          vIntersection={this.props.vIntersection}
          origin={this.props.origin}
        />
        {this.renderDistanceHandles()}

      </Group>
    )
  }

  private renderDistanceHandles() {
    if (!this.props.anchorPositionIsValid) {
      return null
    }

    let normal = {
      x: this.props.anchorPosition.y - this.props.handlePositions[0].y,
      y: -this.props.anchorPosition.x + this.props.handlePositions[0].x
    }
    return (
      <Group>
        <ControlPolyline
          dimmed={true}
          dashed={true}
          color={Palette.referenceDistanceControlColor}
          points={[this.props.anchorPosition, this.props.handlePositions[1]]}
        />
        <ControlPolyline
          color={Palette.referenceDistanceControlColor}
          points={[this.props.handlePositions[0], this.props.handlePositions[1]]}
        />
        <ControlPoint
          lineNormal={normal}
          absolutePosition={this.props.handlePositions[0]}
          onControlPointDrag={(position: Point2D) => {
            this.props.handleDragCallback(0, position)
          }}
          stroke={Palette.referenceDistanceControlColor}
        />
        <ControlPoint
          lineNormal={normal}
          absolutePosition={this.props.handlePositions[1]}
          onControlPointDrag={(position: Point2D) => {
            this.props.handleDragCallback(1, position)
          }}
          stroke={Palette.referenceDistanceControlColor}
        />
      </Group>
    )
  }
}
