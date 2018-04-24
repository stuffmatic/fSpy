import * as React from 'react';
import ControlPoint from './../components/control-point'

interface ControlPointsContainerProps {
  left: number
  top: number
  width: number
  height: number
}

interface ControlPointsContainerState {
  x: number
  y: number
}

export default class ControlPointsContainer extends React.Component<ControlPointsContainerProps, ControlPointsContainerState> {

  constructor(props: ControlPointsContainerProps) {
    super(props)
    this.state = {
      x: 0,
      y: 0
    }
  }

  render() {
    return (
      <svg style={
        {
          top: this.props.top,
          left: this.props.left,
          width: this.props.width,
          height: this.props.height,
          position: "absolute",
          backgroundColor: "red",
          opacity: 0.4
        }
      }
      >
        <g>
          <ControlPoint
            x={this.state.x}
            y={this.state.y}
            dragCallback={(x: number, y: number) => this.onControlPointMove(x, y)}
          />
        </g>
      </svg>
    )
  }

  onControlPointMove(x: number, y: number) {
    console.log("controlPointDragCallback " + x + ", " + y)
    this.setState({
      x: Math.max(0, x),
      y: Math.max(0, y)
    })
  }
}