import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { VanishingPointControlState, Point2D } from '../types/control-points-state';

interface VanishingPointControlProps {
  color:string
  vanishingPointIndex:number
  controlState:VanishingPointControlState

  onControlPointDrag(
    vanishingPointIndex:number,
    vanishingLineIndex:number,
    pointPairIndex:number,
    position: Point2D
  ):void
}

export default function VanishingPointControl(props: VanishingPointControlProps) {
  //TODO: two nested for loops?
  return (
    <g>
      <ControlLine
        start={props.controlState.vanishingLines[0][0]}
        end={props.controlState.vanishingLines[0][1]}
        color={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[0][0]}
        dragCallback={ (position:Point2D) => {
          props.onControlPointDrag(props.vanishingPointIndex, 0, 0, position)
        }}
        fill={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[0][1]}
        dragCallback={ (position:Point2D) => {
          props.onControlPointDrag(props.vanishingPointIndex, 0, 1, position)
        }}
        fill={props.color}
      />
      <ControlLine
        start={props.controlState.vanishingLines[1][0]}
        end={props.controlState.vanishingLines[1][1]}
        color={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[1][0]}
        dragCallback={ (position:Point2D) => {
          props.onControlPointDrag(props.vanishingPointIndex, 1, 0, position)
        }}
        fill={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[1][1]}
        dragCallback={ (position:Point2D) => {
          props.onControlPointDrag(props.vanishingPointIndex, 1, 1, position)
        }}
        fill={props.color}
      />
    </g>
  )
}