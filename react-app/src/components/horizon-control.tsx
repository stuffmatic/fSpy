import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { ControlPointPairState, ControlPointPairIndex } from '../types/control-points-state';
import Point2D from '../solver/point-2d';

interface HorizonControlProps {
  enabled:boolean
  pointPair:ControlPointPairState
  dragCallback(controlPointIndex:ControlPointPairIndex, position:Point2D): void
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
        dragCallback={(position:Point2D) => {
          props.dragCallback(ControlPointPairIndex.First, position)
        }}
        fill="yellow"
      />
      <ControlPoint
        position={props.pointPair[1]}
        dragCallback={(position:Point2D) => {
          props.dragCallback(ControlPointPairIndex.Second, position)
        }}
        fill="yellow"
      />
    </g>
  )
}