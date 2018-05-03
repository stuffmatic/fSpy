import * as React from 'react';
import CalibrationResult from '../../types/calibration-result';
import { CalibrationMode } from '../../types/global-settings';
import ResultSectionBottom from './result-section-bottom'
import TableRow from './table-row'
import MatrixView from './matrix-view'
import WarningsList from './warnings-list'
import { ImageState } from '../../types/image-state';


interface ResultPanelProps {
  calibrationMode: CalibrationMode
  calibrationResult: CalibrationResult
  image: ImageState
}

export default class ResultPanel extends React.PureComponent<ResultPanelProps> {
  render() {

    return (
      <div id="right-panel" className="side-panel">
        <div id="panel-container">
          <div id="panel-top-container">
            <div className="panel-section bottom-border">
              <TableRow
                title={"Image size"}
                value={this.props.image.width + " x " + this.props.image.height}
              />
            </div>
            <div className="panel-section bottom-border">
              <TableRow
                title={"Horizontal field of view"}
                value={"x°"}
              />
              <TableRow
                title={"Vertical field of view"}
                value={"x°"}
              />
            </div>
            <div className="panel-section bottom-border">
              <TableRow
                title={"Relative focal length"}
                value={"x"}
              />
              <TableRow
                title={"Absolute focal length"}
                value={"y"}
              />
            </div>
            <div className="panel-section bottom-border">
              <div className="panel-row" >Camera transform matrix</div>
              <MatrixView transform={this.props.calibrationResult.calibrationResult2VP.cameraParameters.cameraTransform} />
            </div>
            <div className="panel-section bottom-border">
              <WarningsList
                warnings={[
                  "Se upp med en grej!",
                  "Se upp med en grej till annars kan det gå riktigt snett!"
                ]}
              />
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