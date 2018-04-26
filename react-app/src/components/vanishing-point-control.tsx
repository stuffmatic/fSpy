import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { Point2D, VanishingPointControlState } from '../types/store-state';

interface VanishingPointControlProps {
  //TODO: use VanishingPointControlState instead here?
  controlState:VanishingPointControlState

  vanishingLine1StartDragCallback(position: Point2D): void
  vanishingLine1EndDragCallback(position: Point2D): void
  vanishingLine2StartDragCallback(position: Point2D): void
  vanishingLine2EndDragCallback(position: Point2D): void
  color:string
}

export default function VanishingPointControl(props: VanishingPointControlProps) {
  return (
    <g>
      <ControlLine
        start={props.controlState.vanishingLines[0][0]}
        end={props.controlState.vanishingLines[0][1]}
        color={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[0][0]}
        dragCallback={props.vanishingLine1StartDragCallback}
        fill={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[0][1]}
        dragCallback={props.vanishingLine1EndDragCallback}
        fill={props.color}
      />
      <ControlLine
        start={props.controlState.vanishingLines[1][0]}
        end={props.controlState.vanishingLines[1][1]}
        color={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[1][0]}
        dragCallback={props.vanishingLine2StartDragCallback}
        fill={props.color}
      />
      <ControlPoint
        position={props.controlState.vanishingLines[1][1]}
        dragCallback={props.vanishingLine2EndDragCallback}
        fill={props.color}
      />
    </g>
  )
}