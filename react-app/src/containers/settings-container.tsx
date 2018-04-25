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
  console.log("Rendering settings panel")
  return (
    <div style={SidePanelStyle}>

    </div>
  )
}

export function mapStateToProps(state: StoreState) {
  let result = {
    x: state.controlPointsState.x,
    y: state.controlPointsState.y
  }
  return result
}


export default connect(mapStateToProps, null)(SettingsContainer);