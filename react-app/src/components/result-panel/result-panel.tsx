import * as React from 'react';
import CalibrationResult from '../../types/calibration-result';
import { CalibrationMode } from '../../types/global-settings';

interface ResultPanelProps {
  calibrationMode: CalibrationMode
  calibrationResult: CalibrationResult
}

export default class ResultPanel extends React.PureComponent<ResultPanelProps> {
  render() {

    return (
      <div id="result-container">
        <pre style= {{fontSize: "7px" }}>
          { JSON.stringify(this.props.calibrationResult, null, 2) }
        </pre>
      </div>
    )
  }

}