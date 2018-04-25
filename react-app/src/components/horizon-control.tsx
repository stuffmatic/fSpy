import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { Point2D } from '../types/store-state';

interface HorizonControlProps {
  enabled:boolean
  start: Point2D
  end: Point2D
  startDragCallback(position:Point2D): void
  endDragCallback(position:Point2D): void
}

export default function HorizonControl(props: HorizonControlProps) {
  return (
    <g>
      <ControlLine
        start={props.start}
        end={props.end}
        color="yellow"
      />
      <ControlPoint
        position={props.start}
        dragCallback={props.startDragCallback}
        fill="yellow"
      />
      <ControlPoint
        position={props.end}
        dragCallback={props.endDragCallback}
        fill="yellow"
      />
    </g>
  )
}