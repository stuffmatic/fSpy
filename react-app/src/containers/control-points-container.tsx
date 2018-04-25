import * as React from 'react';
import ControlPoint from './../components/control-point'
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../types/store-state';
import { AppAction, setPrincipalPointPosition } from '../actions';

interface ControlPointsContainerOwnProps {
  left: number
  top: number
  width: number
  height: number
}

interface ControlPointsContainerProps {
  x: number,
  y: number
  onControlPointMove(x:number, y:number):void
}

function ControlPointsContainer(props: ControlPointsContainerProps & ControlPointsContainerOwnProps) {
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
      <g>
        <ControlPoint
          x={props.x * props.width}
          y={props.y * props.height}
          dragCallback={(x: number, y: number) => props.onControlPointMove(x / props.width, y / props.height)}
        />
      </g>
    </svg>
  )
}

export function mapStateToProps(state: StoreState, ownProps:ControlPointsContainerOwnProps) {
  let result = {
    x: state.controlPointsState.x,
    y: state.controlPointsState.y
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onControlPointMove: (x: number, y: number) => dispatch(setPrincipalPointPosition(x, y)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);