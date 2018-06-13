import * as React from 'react'
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'

interface PrincipalPointControlProps {
  absolutePosition: Point2D
  enabled: boolean
  visible: boolean
  dragCallback(absolutePosition: Point2D): void
}

export default function PrincipalPointControl(props: PrincipalPointControlProps) {
  if (!props.visible) {
    return null
  }

  return (
    <ControlPoint
      isDragDisabled={!props.enabled}
      absolutePosition={props.absolutePosition}
      onControlPointDrag={ props.dragCallback }
      fill={props.enabled ? Palette.orange : undefined}
      stroke={props.enabled ? undefined : Palette.orange}
    />
  )
}
