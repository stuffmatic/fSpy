import * as React from 'react';
import CalibrationResult from '../types/calibration-result';
import { CalibrationMode } from '../types/global-settings';

interface ResultPanelProps {
  calibrationMode: CalibrationMode
  calibrationResult: CalibrationResult
}

export default class ResultPanel extends React.PureComponent<ResultPanelProps> {
  render() {

    return (
      <div id="result-container">
        <p> {this.props.calibrationMode} </p>
        <p>
          1VP errors: {this.props.calibrationResult.calibrationResult1VP.errors}
        </p>
        <p>
          2VP errors: {this.props.calibrationResult.calibrationResult2VP.errors}
        </p>
      </div>
    )
  }

}