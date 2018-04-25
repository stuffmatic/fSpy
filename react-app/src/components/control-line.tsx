import * as React from 'react';
import { Point2D } from '../types/store-state';

interface ControlLineProps {
  start: Point2D
  end: Point2D
  color: string
}

export default function ControlLine(props:ControlLineProps) {
  return (
    <line
      x1={props.start.x}
      y1={props.start.y}
      x2={props.end.x}
      y2={props.end.y}
      stroke={props.color} strokeWidth={2}
    />
  )
}