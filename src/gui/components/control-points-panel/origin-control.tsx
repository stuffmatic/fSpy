import * as React from 'react'
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'

interface OriginControlProps {
  absolutePosition: Point2D
  dragCallback(position: Point2D): void
}

export default function OriginControl(props: OriginControlProps) {
  return (
    <ControlPoint
      absolutePosition={props.absolutePosition}
      onControlPointDrag={props.dragCallback}
      fill='white'
    />
  )
}
