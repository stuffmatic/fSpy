import React from 'react'
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'
import { Group } from 'react-konva'
import { Palette } from '../../style/palette'
import ControlPolyline from './control-polyline'

interface ReferenceDistanceAnchorControlProps {
  absolutePosition: Point2D
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  dragCallback(position: Point2D): void
}

export default function ReferenceDistanceAnchorControl(props: ReferenceDistanceAnchorControlProps) {
  return (
    <Group>
      <ControlPolyline dimmed={true} dashed={true} color={Palette.lightGray} points={[props.origin, props.uIntersection]}/>
      <ControlPolyline dimmed={true} dashed={true} color={Palette.lightGray} points={[props.origin, props.vIntersection]}/>
      <ControlPolyline dimmed={true} dashed={true} color={Palette.lightGray} points={[props.absolutePosition, props.uIntersection]}/>
      <ControlPolyline dimmed={true} dashed={true} color={Palette.lightGray} points={[props.absolutePosition, props.vIntersection]}/>

      <ControlPoint
        absolutePosition={props.absolutePosition}
        onControlPointDrag={props.dragCallback}
        fill={Palette.gray}
      />
    </Group>
  )
}
