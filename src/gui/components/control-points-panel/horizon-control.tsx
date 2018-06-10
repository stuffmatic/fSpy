import * as React from 'react'
import ControlLine from './control-line'
import ControlPoint from './control-point'
import { Group } from 'react-konva'
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
    <Group>
      <ControlLine
        start={props.pointPair[0]}
        end={props.pointPair[1]}
        color={Palette.yellow}
      />
      <ControlPoint
        absolutePosition={props.pointPair[0]}
        onControlPointDrag={(position: Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.First, position)
          }
        }}
        fill={Palette.yellow}
      />
      <ControlPoint
        absolutePosition={props.pointPair[1]}
        onControlPointDrag={(position: Point2D) => {
          if (props.enabled) {
            props.dragCallback(ControlPointPairIndex.Second, position)
          }
        }}
        fill={Palette.yellow}
      />
    </Group>
  )
}
