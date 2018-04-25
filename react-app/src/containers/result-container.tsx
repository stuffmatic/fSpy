import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';
import { StoreState } from '../types/store-state';
import { connect } from 'react-redux';

interface ResultContainerProps {
  x: number
  y: number
}

function ResultContainer(props:ResultContainerProps) {
  return (
    <div style={SidePanelStyle}>
      { props.x } <br/> { props.y }
    </div>
  )
}

export function mapStateToProps(state: StoreState) {
  let result = {
    x: 666, //state.controlPointsState.x,
    y: 666 //state.controlPointsState.y
  }
  return result
}


export default connect(mapStateToProps, null)(ResultContainer);