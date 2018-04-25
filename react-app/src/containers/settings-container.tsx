import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';
import { StoreState } from '../types/store-state';
import { connect } from 'react-redux';

interface SettingsContainerProps {
  /*x:number
  y:number*/
}

interface SettingsContainerProps {
  x: number
  y: number
}

function SettingsContainer(props:SettingsContainerProps) {
  return (
    <div style={SidePanelStyle}>

    </div>
  )
}

export function mapStateToProps(state: StoreState) {
  let result = {
    x: 666,//state.controlPointsState.x,
    y: 666 //state.controlPointsState.y
  }
  return result
}


export default connect(mapStateToProps, null)(SettingsContainer);