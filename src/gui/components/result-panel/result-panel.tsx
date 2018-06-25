import * as React from 'react'
import Button from './../common/button'
import TableRow from './table-row'
import MatrixView from './matrix-view'
import BulletList, { BulletListType } from './bullet-list'
import { ImageState } from '../../types/image-state'
import { SolverResult } from '../../solver/solver-result'
import FocalLengthForm from '../common/focal-length-form'
import { CalibrationSettingsBase } from '../../types/calibration-settings'
import { cameraPresets } from '../../solver/camera-presets'
import { GlobalSettings, CalibrationMode } from '../../types/global-settings'

interface ResultPanelProps {
  globalSettings: GlobalSettings
  calibrationSettings: CalibrationSettingsBase
  solverResult: SolverResult
  image: ImageState
  onExportClicked(): void
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
}

export default class ResultPanel extends React.PureComponent<ResultPanelProps> {
  render() {
    return (
      <div id='right-panel' className='side-panel'>
        {this.renderPanelContents()}
      </div>
    )
  }

  private renderPanelContents() {
    let relativeFocalLength = this.props.solverResult.relativeFocalLength
    if (!relativeFocalLength) {
      return null
    }

    let cameraData = this.props.calibrationSettings.cameraData
    let sensorWidth = cameraData.customSensorWidth
    let sensorHeight = cameraData.customSensorHeight
    if (cameraData.presetId) {
      let preset = cameraPresets[cameraData.presetId]
      sensorWidth = preset.sensorWidth
      sensorHeight = preset.sensorHeight
    }
    let sensorAspectRatio = sensorHeight > 0 ? sensorWidth / sensorHeight : 1
    let absoluteFocalLength = 0
    if (sensorAspectRatio > 1) {
      // wide sensor.
      absoluteFocalLength = 0.5 * sensorWidth * relativeFocalLength
    } else {
      // tall sensor
      absoluteFocalLength = 0.5 * sensorHeight * relativeFocalLength
    }

    return (
      <div id='panel-container'>
        <div id='panel-top-container'>
          <div className='panel-section bottom-border'>
            <TableRow
              title={'Image size'}
              value={this.props.image.width + ' x ' + this.props.image.height}
            />
          </div>
          <div className='panel-section bottom-border'>
            <TableRow
              title={'Horizontal field of view'}
              value={this.props.solverResult.horizontalFieldOfView ? (180 * this.props.solverResult.horizontalFieldOfView / Math.PI) : null}
              unit={'°'}
            />
            <TableRow
              title={'Vertical field of view'}
              value={this.props.solverResult.verticalFieldOfView ? (180 * this.props.solverResult.verticalFieldOfView / Math.PI) : null}
              unit={'°'}
            />
          </div>
          <div className='panel-section bottom-border'>
            <FocalLengthForm
              presetSelectionDisabled={this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint}
              focalLengthInputDisabled={true}
              absoluteFocalLength={absoluteFocalLength}
              cameraData={cameraData}
              onAbsoluteFocalLengthChange={(_: number) => {
                // setting focal length not allowed in result panel
              }}
              onCameraPresetChange={this.props.onCameraPresetChange}
              onSensorSizeChange={this.props.onSensorSizeChange}
            />
          </div>
          <div className='panel-section bottom-border'>
            <div className='panel-row' >Camera rotation matrix</div>
            <MatrixView
              rows={this.props.solverResult.cameraTransform ? this.props.solverResult.cameraTransform.matrix : null}
            />
          </div>
          <div className='panel-section bottom-border'>
            <div className='panel-row' >Camera translation</div>
            <MatrixView
              rows={
                this.props.solverResult.cameraTransform ? [[this.props.solverResult.cameraTransform.matrix[0][3], this.props.solverResult.cameraTransform.matrix[1][3], this.props.solverResult.cameraTransform.matrix[2][3]]] : null
              }
            />
          </div>

          <div className='panel-section bottom-border'>
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
            <div className='panel-section top-border'>
              <Button title={'Export'} onClick={() => { this.props.onExportClicked() }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
