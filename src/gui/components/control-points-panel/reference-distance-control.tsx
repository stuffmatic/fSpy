import * as React from 'react'
import ControlPoint from './control-point'
import ReferenceDistanceAnchorControl from './reference-distance-anchor-control'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'
import { Group } from 'react-konva'
import ControlPolyline from './control-polyline'

export const dashedRulerStyle = { stroke: Palette.gray, opacity: 0.5, strokeDasharray: '2,6' }

interface ReferenceDistanceControlProps {
  anchorPosition: Point2D
  handlePositions: [Point2D, Point2D]
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  anchorPositionIsValid: boolean
  anchorDragCallback(position: Point2D): void
  handleDragCallback(handleIndex: number, offset: Point2D): void
}

export default class ReferenceDistanceControl extends React.PureComponent<ReferenceDistanceControlProps> {
  render() {
    return (
      <Group>

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
        <ControlPolyline dimmed={true} dashed={true} color={Palette.gray} points={[this.props.anchorPosition, this.props.handlePositions[1]]} />
        <ControlPolyline color={Palette.gray} points={[this.props.handlePositions[0], this.props.handlePositions[1]]} />
        <ControlPoint
          lineNormal={normal}
          absolutePosition={this.props.handlePositions[0]}
          onControlPointDrag={(position: Point2D) => {
            this.props.handleDragCallback(0, position)
          }}
          stroke={Palette.gray}
        />
        <ControlPoint
          lineNormal={normal}
          absolutePosition={this.props.handlePositions[1]}
          onControlPointDrag={(position: Point2D) => {
            this.props.handleDragCallback(1, position)
          }}
          stroke={Palette.gray}
        />
      </Group>
    )
  }
}
