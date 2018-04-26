import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { Point2D } from '../types/store-state';

interface VanishingPointControlProps {
  //TODO: use VanishingPointControlState instead here?
  vanishingLine1Start: Point2D
  vanishingLine1End: Point2D
  vanishingLine2Start: Point2D
  vanishingLine2End: Point2D

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
        start={props.vanishingLine1Start}
        end={props.vanishingLine1End}
        color={props.color}
      />
      <ControlPoint
        position={props.vanishingLine1Start}
        dragCallback={props.vanishingLine1StartDragCallback}
        fill={props.color}
      />
      <ControlPoint
        position={props.vanishingLine1End}
        dragCallback={props.vanishingLine1EndDragCallback}
        fill={props.color}
      />

      <ControlLine
        start={props.vanishingLine2Start}
        end={props.vanishingLine2End}
        color={props.color}
      />
      <ControlPoint
        position={props.vanishingLine2Start}
        dragCallback={props.vanishingLine2StartDragCallback}
        fill={props.color}
      />
      <ControlPoint
        position={props.vanishingLine2End}
        dragCallback={props.vanishingLine2EndDragCallback}
        fill={props.color}
      />
    </g>
  )
}