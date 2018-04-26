import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { Point2D, ControlPointPairState } from '../types/store-state';

interface HorizonControlProps {
  enabled:boolean
  pointPair:ControlPointPairState
  startDragCallback(position:Point2D): void
  endDragCallback(position:Point2D): void
}

export default function HorizonControl(props: HorizonControlProps) {
  return (
    <g>
      <ControlLine
        start={props.pointPair[0]}
        end={props.pointPair[1]}
        color="yellow"
      />
      <ControlPoint
        position={props.pointPair[0]}
        dragCallback={props.startDragCallback}
        fill="yellow"
      />
      <ControlPoint
        position={props.pointPair[1]}
        dragCallback={props.endDragCallback}
        fill="yellow"
      />
    </g>
  )
}