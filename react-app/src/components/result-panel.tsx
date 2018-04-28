import * as React from 'react';
import CalibrationResult from '../types/calibration-result';
import { CalibrationMode } from '../types/global-settings';
import { SidePanelStyle } from './../styles/styles';

interface ResultPanelProps {
  calibrationMode: CalibrationMode
  calibrationResult: CalibrationResult
}

export default function ResultPanel(props: ResultPanelProps)  {
  return (
    <div style={SidePanelStyle}>
      <p> {props.calibrationMode} </p>
      <p>
        1VP errors: {props.calibrationResult.calibrationResult1VP.errors}
      </p>
      <p>
        2VP errors: {props.calibrationResult.calibrationResult2VP.errors}
      </p>
    </div>
  )
}