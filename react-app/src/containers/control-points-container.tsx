import * as React from 'react';
import ControlPoint from './../components/control-point'
import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../types/store-state';
import { Action, moveControlPoint } from '../actions';

interface ControlPointsContainerProps {
  /*left: number
  top: number
  width: number
  height: number*/
  x: number,
  y: number
  onControlPointMove(x:number, y:number):void
}


function ControlPointsContainer(props: ControlPointsContainerProps) {
  console.log("Rendering with props")
  console.log(props)
  return (
    <svg style={
      {
        top:  0,//props.top,
        left: 0,//props.left,
        width: 200,//props.width,
        height: 200,//props.height,
        position: "absolute",
        backgroundColor: "red",
        opacity: 0.4
      }
    }
    >
      <g>
        <ControlPoint
          x={props.x ? props.x : 50}
          y={props.y ? props.y : 50}
          dragCallback={(x: number, y: number) => props.onControlPointMove(x, y)}
        />
      </g>
    </svg>
  )
}


  /*onControlPointMove(x: number, y: number) {
    console.log("controlPointDragCallback " + x + ", " + y)
    //TODO: dispatch
    TODO: dispatch
  }*/

export function mapStateToProps(state: StoreState) {
  console.log("Mapping")
  console.log(state)
  let result = {
    x: state.controlPointsState.x,
    y: state.controlPointsState.y
  }
  console.log("to")
  console.log(result)
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onControlPointMove: (x: number, y: number) => dispatch(moveControlPoint(x, y)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);