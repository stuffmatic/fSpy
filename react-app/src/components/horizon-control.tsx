import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { ControlPointPairState, ControlPointPairIndex } from '../types/control-points-state';
import Point2D from '../solver/point-2d';

interface HorizonControlProps {
  enabled:boolean
  pointPair:ControlPointPairState
  pointPairDisabled:ControlPointPairState
  dragCallback(controlPointIndex:ControlPointPairIndex, position:Point2D): void
}

export default function HorizonControl(props: HorizonControlProps) {
  let controlPointStroke = props.enabled ? "none" : "yellow"
  let controlPointFill = props.enabled ? "yellow" : "none"
  let start = props.enabled ? props.pointPair[0] : props.pointPairDisabled[0]
  let end = props.enabled ? props.pointPair[1] : props.pointPairDisabled[1]
  return (
    <g>
      <ControlLine
        start={start}
        end={end}
        color="yellow"
      />
      <ControlPoint
        position={start}
        dragCallback={(position:Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.First, position)
          }
        }}
        fill={controlPointFill}
        stroke={controlPointStroke}
      />
      <ControlPoint
        position={end}
        dragCallback={(position:Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.Second, position)
          }
        }}
        fill={controlPointFill}
        stroke={controlPointStroke}
      />
    </g>
  )
}