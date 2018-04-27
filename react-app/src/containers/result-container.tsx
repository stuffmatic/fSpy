import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';
import { StoreState } from '../types/store-state';
import { connect } from 'react-redux';
import CalibrationResult from '../types/calibration-result';

interface ResultContainerProps {
  result:CalibrationResult | null
}

function ResultContainer(props:ResultContainerProps) {
  return (
    <div style={SidePanelStyle}>
    <p>{props.result ? props.result.dummy : "null result"}</p>
    </div>
  )
}

export function mapStateToProps(state: StoreState) {
  return {
    result: state.calibrationResult
  }
}


export default connect(mapStateToProps, null)(ResultContainer);