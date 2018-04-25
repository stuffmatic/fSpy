import * as React from 'react';
import ControlPoint from './control-point'

export interface ControlPointsPanelProps {
  left: number
  top: number
  width: number
  height: number
  x: number,
  y: number
  onPrincipalPointDrag(x:number, y:number):void
}

function ControlPointsPanel(props:ControlPointsPanelProps) {
  return (
    <svg style={
      {
        top:  props.top,
        left: props.left,
        width: props.width,
        height: props.height,
        position: "absolute",
      }
    }
    >
      { (props as any).children }
      <g>
        <ControlPoint
          x={props.x * props.width}
          y={props.y * props.height}
          dragCallback={(x: number, y: number) => {
            props.onPrincipalPointDrag(x / props.width, y / props.height)
          }}
        />
      </g>
    </svg>
  )
}

export default ControlPointsPanel