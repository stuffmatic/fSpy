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
import PanelSpacer from '../common/panel-spacer'

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
    return (
      <div>
        <div id='panel-container'>
          {this.renderErrors()}
          {this.renderCameraParameters()}
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

  private renderErrors() {
    if (this.props.solverResult.errors.length == 0) {
      return null
    }

    return (
      <div className='panel-section'>
        <BulletList
          messages={
            this.props.solverResult.errors
          }
          type={BulletListType.Errors}
        />
      </div>
    )
  }

  private renderCameraParameters() {
    let cameraParameters = this.props.solverResult.cameraParameters
    if (!cameraParameters) {
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
      absoluteFocalLength = 0.5 * sensorWidth * cameraParameters.relativeFocalLength
    } else {
      // tall sensor
      absoluteFocalLength = 0.5 * sensorHeight * cameraParameters.relativeFocalLength
    }

    return (
      <div>
        <div className='panel-section bottom-border'>
          <TableRow
            title={'Image size'}
            value={this.props.image.width + ' x ' + this.props.image.height}
          />
        </div>
        <div className='panel-section bottom-border'>
          <TableRow
            title={'Horizontal field of view'}
            value={cameraParameters.horizontalFieldOfView ? (180 * cameraParameters.horizontalFieldOfView / Math.PI).toFixed(2) : null}
            unit={'°'}
          />
          <PanelSpacer />
          <TableRow
            title={'Vertical field of view'}
            value={cameraParameters.verticalFieldOfView ? (180 * cameraParameters.verticalFieldOfView / Math.PI).toFixed(2) : null}
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
          <div className='panel-group-title' >Camera rotation matrix</div>
          <MatrixView
            rows={cameraParameters.cameraTransform ? cameraParameters.cameraTransform.matrix.slice(0, 3) : null}
          />
        </div>
        <div className='panel-section bottom-border'>
          <div className='panel-group-title' >Camera translation</div>
          <MatrixView
            rows={
              cameraParameters.cameraTransform ? [[cameraParameters.cameraTransform.matrix[0][3], cameraParameters.cameraTransform.matrix[1][3], cameraParameters.cameraTransform.matrix[2][3]]] : null
            }
          />
        </div>
        <div className='panel-section'>
          <Button fillWidth={true} title={'Export'} onClick={() => { this.props.onExportClicked() }} />
        </div>
        {this.renderWarnings()}
      </div>
    )
  }

  private renderWarnings() {
    if (this.props.solverResult.warnings.length == 0) {
      return null
    }
    return (
      <div className='panel-section top-border'>
        <BulletList
          messages={
            this.props.solverResult.warnings
          }
          type={BulletListType.Warnings}
        />
      </div>
    )
  }
}
