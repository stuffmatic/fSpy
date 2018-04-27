import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';
import { CalibrationMode } from '../types/store-state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppAction, setCalibrationMode, setImageOpacity } from '../actions';

interface SettingsContainerProps {
  onCalibrationModeChange(calibrationMode:CalibrationMode):void
  onImageOpacityChange(opacity:number):void
}

function SettingsContainer(props:SettingsContainerProps) {
  return (
    <div style={SidePanelStyle}>
      <button onClick= { () => {
        props.onCalibrationModeChange(CalibrationMode.OneVanishingPoint)
      }}>
        1 VP
      </button>
      <button onClick= { () => {
        props.onCalibrationModeChange(CalibrationMode.TwoVanishingPoints)
      }}>
        2 VP
      </button>
      <button onClick= { () => {
        props.onImageOpacityChange(1)
      }}>
        Opaque
      </button>
      <button onClick= { () => {
        props.onImageOpacityChange(0.2)
      }}>
        Dimmed
      </button>
    </div>
  )
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onCalibrationModeChange: (calibrationMode:CalibrationMode) => {
      dispatch(setCalibrationMode(calibrationMode))
    },
    onImageOpacityChange: (opacity:number) => {
      dispatch(setImageOpacity(opacity))
    }
  }
}

export default connect(null, mapDispatchToProps)(SettingsContainer);