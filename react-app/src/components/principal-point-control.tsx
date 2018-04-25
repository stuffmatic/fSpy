import * as React from 'react';
import ControlPoint from './control-point'

interface PrincipalPointControlProps {
  x: number
  y: number
  dragCallback(x: number, y: number): void
}

export default function PrincipalPointControl(props: PrincipalPointControlProps) {
return (
    <ControlPoint
      x={props.y}
      y={props.x}
      dragCallback={props.dragCallback}
      fill="orange"
    />
  )
}