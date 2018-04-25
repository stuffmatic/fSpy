import * as React from 'react';
import ControlLine from './control-line'
import ControlPoint from './control-point'

interface HorizonControlProps {
  enabled:boolean
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
  startDragCallback(x: number, y: number): void
  endDragCallback(x: number, y: number): void
}

export default function HorizonControl(props: HorizonControlProps) {
  return (
    <g>
      <ControlLine
        xStart={props.start.x}
        yStart={props.start.y}
        xEnd={props.end.x}
        yEnd={props.end.y}
        color="yellow"
      />
      <ControlPoint
        x={props.start.x}
        y={props.start.y}
        dragCallback={props.startDragCallback}
        fill="yellow"
      />
      <ControlPoint
        x={props.end.x}
        y={props.end.y}
        dragCallback={props.endDragCallback}
        fill="yellow"
      />
    </g>
  )
}