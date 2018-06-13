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
  anchorDragCallback(position: Point2D): void
  handleDragCallback(handleIndex: number, offset: Point2D): void
}

export default function ReferenceDistanceControl(props: ReferenceDistanceControlProps) {
  return (
    <Group>
      <ControlPolyline dimmed={true} dashed={true} color={Palette.gray} points={[props.anchorPosition, props.handlePositions[1]]} />
      <ControlPolyline color={Palette.gray} points={[props.handlePositions[0], props.handlePositions[1]]} />

      <ReferenceDistanceAnchorControl
        absolutePosition={props.anchorPosition}
        dragCallback={props.anchorDragCallback}
        uIntersection={props.uIntersection}
        vIntersection={props.vIntersection}
        origin={props.origin}
      />
      <ControlPoint
        absolutePosition={props.handlePositions[0]}
        onControlPointDrag={(position: Point2D) => {
          props.handleDragCallback(0, position)
        }}
        fill={Palette.gray}
      />
      <ControlPoint
        absolutePosition={props.handlePositions[1]}
        onControlPointDrag={(position: Point2D) => {
          props.handleDragCallback(1, position)
        }}
        fill={Palette.gray}
      />

    </Group>
  )
}
