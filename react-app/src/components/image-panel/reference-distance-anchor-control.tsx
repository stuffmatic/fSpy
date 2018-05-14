import * as React from 'react';
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d';
import { Palette } from '../../style/palette';

interface ReferenceDistanceAnchorControlProps {
  position: Point2D
  dragCallback(position: Point2D): void
}

export default function ReferenceDistanceAnchorControl(props: ReferenceDistanceAnchorControlProps) {
  return (
    <ControlPoint
      position={props.position}
      dragCallback={props.dragCallback}
      fill={Palette.gray}
    />
  )
}