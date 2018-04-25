import * as React from 'react';
import ControlPoint from './control-point'

interface OriginControlProps {
  x: number
  y: number
  dragCallback(x: number, y: number): void
}

export default function OriginControl(props: OriginControlProps) {
return (
    <ControlPoint
      x={props.y}
      y={props.x}
      dragCallback={props.dragCallback}
      fill="white"
    />
  )
}