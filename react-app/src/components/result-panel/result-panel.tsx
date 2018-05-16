import * as React from 'react';
import Button from './../common/button'
import TableRow from './table-row'
import RotationMatrixView from './rotation-matrix-view'
import BulletList, { BulletListType } from './bullet-list'
import { ImageState } from '../../types/image-state';
import { SolverResult } from '../../solver/solver-result';


interface ResultPanelProps {
  solverResult:SolverResult
  image: ImageState
  onExportClicked():void
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
                value={this.props.solverResult.horizontalFieldOfView ? (180 * this.props.solverResult.horizontalFieldOfView / Math.PI) : null}
                unit={"°"}
              />
              <TableRow
                title={"Vertical field of view"}
                value={this.props.solverResult.verticalFieldOfView ? (180 * this.props.solverResult.verticalFieldOfView / Math.PI) : null}
                unit={"°"}
              />
            </div>
            <div className="panel-section bottom-border">
              <TableRow
                title={"Relative focal length"}
                value={this.props.solverResult.relativeFocalLength}
              />
            </div>
            <div className="panel-section bottom-border">
              <div className="panel-row" >Camera rotation matrix</div>
              <RotationMatrixView transform={this.props.solverResult.cameraTransform} />
            </div>
            <div className="panel-section bottom-border">
              <div className="panel-row" >Camera translation</div>

            </div>

            <div className="panel-section bottom-border">
              <BulletList
                messages={
                  this.props.solverResult.warnings
                }
                type={BulletListType.Warnings}
              />
            </div>
          </div>
          <div>
            <div>
              <div className="panel-section top-border">
                <Button title={"Export"} onClick={() => {this.props.onExportClicked() }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

}