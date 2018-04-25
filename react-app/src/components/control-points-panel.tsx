import * as React from 'react';
import PrincipalPointControl from './principal-point-control'

export interface ControlPointsPanelProps {
  left: number
  top: number
  width: number
  height: number
  x: number,
  y: number
  onPrincipalPointDrag(xRelative: number, yRelative: number): void
}

function ControlPointsPanel(props: ControlPointsPanelProps) {
  let svgStyle: React.CSSProperties = {
    top: props.top,
    left: props.left,
    width: props.width,
    height: props.height,
    position: "absolute"
  }

  return (
    <svg style={svgStyle}>
      {(props as any).children}
      <PrincipalPointControl
        x={props.x * props.width}
        y={props.y * props.height}
        dragCallback={(x: number, y: number) => {
          props.onPrincipalPointDrag(x / props.width, y / props.height)
        }}
      />
    </svg>
  )
}

export default ControlPointsPanel