import * as React from 'react'
import { Line } from 'react-konva'
import Point2D from '../../solver/point-2d'

interface ControlLineProps {
  start: Point2D
  end: Point2D
  color: string
}

export default function ControlLine(props: ControlLineProps) {
  return (
    <Line points={[ props.start.x, props.start.y, props.end.x, props.end.y ]}
      stroke={props.color} strokeWidth={1}
    />
  )
}
