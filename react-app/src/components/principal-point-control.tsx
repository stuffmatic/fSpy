import * as React from 'react';
import ControlPoint from './control-point'
import { Point2D } from '../types/control-points-state';

interface PrincipalPointControlProps {
  position:Point2D
  dragCallback(position:Point2D): void
}

export default function PrincipalPointControl(props: PrincipalPointControlProps) {
return (
    <ControlPoint
      position={props.position}
      dragCallback={props.dragCallback}
      fill="orange"
    />
  )
}