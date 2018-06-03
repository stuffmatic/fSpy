import React from 'react'
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'
import { dashedRulerStyle } from './reference-distance-control'

interface ReferenceDistanceAnchorControlProps {
  position: Point2D
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  dragCallback(position: Point2D): void
}

export default function ReferenceDistanceAnchorControl(props: ReferenceDistanceAnchorControlProps) {
  return (
    <g>
      <g style={dashedRulerStyle}>
        <line x1={props.origin.x} y1={props.origin.y} x2={props.uIntersection.x} y2={props.uIntersection.y} />
        <line x1={props.origin.x} y1={props.origin.y} x2={props.vIntersection.x} y2={props.vIntersection.y} />
        <line x1={props.position.x} y1={props.position.y} x2={props.uIntersection.x} y2={props.uIntersection.y} />
        <line x1={props.position.x} y1={props.position.y} x2={props.vIntersection.x} y2={props.vIntersection.y} />
      </g>
      <ControlPoint
        position={props.position}
        dragCallback={props.dragCallback}
        fill={Palette.gray}
      />
    </g>
  )
}
