import * as React from 'react'
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { ControlPointPairState, ControlPointPairIndex } from '../../types/control-points-state'
import Point2D from '../../solver/point-2d'
import { Palette } from '../../style/palette'

interface HorizonControlProps {
  enabled: boolean
  pointPair: ControlPointPairState
  dragCallback(controlPointIndex: ControlPointPairIndex, position: Point2D): void
}

export default function HorizonControl(props: HorizonControlProps) {
  if (!props.enabled) {
    return null
  }

  return (
    <g>
      <ControlLine
        start={props.pointPair[0]}
        end={props.pointPair[1]}
        color={Palette.yellow}
      />
      <ControlPoint
        position={props.pointPair[0]}
        dragCallback={(position: Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.First, position)
          }
        }}
        fill={Palette.yellow}
      />
      <ControlPoint
        position={props.pointPair[1]}
        dragCallback={(position: Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.Second, position)
          }
        }}
        fill={Palette.yellow}
      />
    </g>
  )
}
