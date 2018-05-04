import * as React from 'react';
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d';
import { Palette } from '../../style/palette';

interface PrincipalPointControlProps {
  position:Point2D
  enabled:boolean
  dragCallback(position:Point2D): void
}

export default function PrincipalPointControl(props: PrincipalPointControlProps) {
return (
    <ControlPoint
      position={props.position}
      dragCallback={props.dragCallback}
      fill={props.enabled ? Palette.orange : "none"}
      stroke={props.enabled ? "none" : Palette.orange}
    />
  )
}