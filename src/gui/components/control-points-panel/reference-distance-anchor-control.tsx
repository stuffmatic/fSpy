import React from 'react'
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'
import { Group, RegularPolygon } from 'react-konva'
import { Palette } from '../../style/palette'
import ControlPolyline from './control-polyline'

interface ReferenceDistanceAnchorControlProps {
  absolutePosition: Point2D
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  anchorPositionIsValid: boolean
  dragCallback(position: Point2D): void
}

export default class ReferenceDistanceAnchorControl extends React.PureComponent<ReferenceDistanceAnchorControlProps> {

  render() {
    return (
      <Group>
        {this.renderLines()}
        {this.renderPositionWarning()}
        <ControlPoint
          absolutePosition={this.props.absolutePosition}
          onControlPointDrag={this.props.dragCallback}
          fill={Palette.gray}
        />
      </Group>
    )
  }

  private renderPositionWarning() {
    if (this.props.anchorPositionIsValid) {
      return null
    }

    return (
      <RegularPolygon
        sides={3}
        radius={20}
        x={this.props.absolutePosition.x}
        y={this.props.absolutePosition.y}
        stroke={Palette.orange}
        strokeWidth={1}
      />
    )
  }

  private renderLines() {
    if (!this.props.anchorPositionIsValid) {
      return null
    }

    return (
      <Group>
        <ControlPolyline
          dimmed={true}
          dashed={true}
          color={Palette.lightGray}
          points={[this.props.origin, this.props.uIntersection]}
        />
        <ControlPolyline
          dimmed={true}
          dashed={true}
          color={Palette.lightGray}
          points={[this.props.origin, this.props.vIntersection]}
        />
        <ControlPolyline
          dimmed={true}
          dashed={true}
          color={Palette.lightGray}
          points={[this.props.absolutePosition, this.props.uIntersection]}
        />
        <ControlPolyline
          dimmed={true}
          dashed={true}
          color={Palette.lightGray}
          points={[this.props.absolutePosition, this.props.vIntersection]}
        />
      </Group>
    )
  }
}
