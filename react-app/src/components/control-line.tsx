import * as React from 'react';

interface ControlLineProps {
  xStart: number
  yStart: number
  xEnd: number
  yEnd: number
  color: string
}

export default function ControlLine(props:ControlLineProps) {
  return (
    <line x1={props.xStart} y1={props.yStart} x2={props.xEnd} y2={props.yEnd} stroke={props.color} strokeWidth={2}/>
  )
}