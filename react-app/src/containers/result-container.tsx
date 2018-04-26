import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';
import { StoreState, CalibrationMode } from '../types/store-state';
import { connect } from 'react-redux';

interface ResultContainerProps {
  x: number
  y: number
  calibrationMode:CalibrationMode
}

function ResultContainer(props:ResultContainerProps) {
  return (
    <div style={SidePanelStyle}>
    <p>{props.calibrationMode}</p>
      { props.x } <br/> { props.y }
    </div>
  )
}

export function mapStateToProps(state: StoreState) {
  let result = {
    x: 666, //state.controlPointsState.x,
    y: 666, //state.controlPointsState.y
    calibrationMode: state.calibrationSettings.calibrationMode
  }
  return result
}


export default connect(mapStateToProps, null)(ResultContainer);