import * as React from 'react';
import ControlPoint from './control-point'

export interface ControlPointsPanelProps {
  isHidden: boolean
  left: number
  top: number
  width: number
  height: number
  x: number,
  y: number
  onPrincipalPointDrag(x:number, y:number):void
}

function ControlPointsPanel(props:ControlPointsPanelProps) {
  let svgStyle:React.CSSProperties = {
    top:  props.top,
    left: props.left,
    width: props.width,
    height: props.height,
    position: "absolute"
  }
  if (props.isHidden) {
    svgStyle.display = "none"
  }

  return (
    <svg style={ svgStyle }
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