import * as React from 'react'
import { Line } from 'react-konva'
import Point2D from '../../solver/point-2d'

interface ControlPolylineProps {
  points: Point2D[]
  color: string
  dimmed?: boolean
  dashed?: boolean
}

export default function ControlPolyline(props: ControlPolylineProps) {
  let coords: number[] = []
  for (let point of props.points) {
    coords.push(point.x)
    coords.push(point.y)
  }
  return (
    <Line points={coords}
      stroke={props.color}
      strokeWidth={1}
      opacity={props.dimmed ? 0.35 : 1}
      dash={ props.dashed ? [3, 6] : undefined }
    />
  )
}
