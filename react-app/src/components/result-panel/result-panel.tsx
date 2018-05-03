import * as React from 'react';
import CalibrationResult from '../../types/calibration-result';
import { CalibrationMode } from '../../types/global-settings';
import ResultSectionBottom from './result-section-bottom'

interface ResultPanelProps {
  calibrationMode: CalibrationMode
  calibrationResult: CalibrationResult
}

export default class ResultPanel extends React.PureComponent<ResultPanelProps> {
  render() {

    return (
      <div id="right-panel" className="side-panel">
        <div id="panel-container">
          <div id="panel-top-container">
            <div className="panel-section bottom-border">
              a
            </div>
            <div className="panel-section bottom-border">
              a
            </div>
            <div className="panel-section bottom-border">
              a
            </div>
          </div>
          <div>
            <div>
              <ResultSectionBottom />
            </div>

          </div>
        </div>
      </div>
    )
  }

}