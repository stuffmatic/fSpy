import * as React from 'react'
import ControlPoint from './control-point'
import ReferenceDistanceAnchorControl from './reference-distance-anchor-control'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'

export const dashedRulerStyle = { stroke: Palette.gray, opacity: 0.5, strokeDasharray: '2,6' }

interface ReferenceDistanceControlProps {
  anchorPosition: Point2D
  handlePositions: [Point2D, Point2D]
  origin: Point2D
  uIntersection: Point2D
  vIntersection: Point2D
  anchorDragCallback(position: Point2D): void
  handleDragCallback(handleIndex: number, offset: Point2D): void
}

export default function ReferenceDistanceControl(props: ReferenceDistanceControlProps) {
  return (
    <g>
      <line style={dashedRulerStyle}
        y1={props.anchorPosition.y}
        x1={props.anchorPosition.x}
        x2={props.handlePositions[1].x}
        y2={props.handlePositions[1].y}
      />
      <line stroke={Palette.gray}
        x1={props.handlePositions[0].x}
        y1={props.handlePositions[0].y}
        x2={props.handlePositions[1].x}
        y2={props.handlePositions[1].y}
      />
      <ReferenceDistanceAnchorControl
        position={props.anchorPosition}
        dragCallback={props.anchorDragCallback}
        uIntersection={props.uIntersection}
        vIntersection={props.vIntersection}
        origin={props.origin}
      />
      <ControlPoint
        position={props.handlePositions[0]}
        dragCallback={(position: Point2D) => {
          props.handleDragCallback(0, position)
        }}
        fill={Palette.gray}
      />
      <ControlPoint
        position={props.handlePositions[1]}
        dragCallback={(position: Point2D) => {
          props.handleDragCallback(1, position)
        }}
        fill={Palette.gray}
      />

    </g>
  )
}
