import * as React from 'react'
import CameraPresetsDropdown from './../common/camera-presets-dropdown'
import NumericInputField from './../common/numeric-input-field'
import PanelSpacer from './../common/panel-spacer'
import { CameraData } from '../../types/calibration-settings'
import { cameraPresets } from '../../solver/camera-presets'

export interface FocalLengthFormProps {
  absoluteFocalLength: number
  cameraData: CameraData
  onAbsoluteFocalLengthChange(absoluteFocalLength: number): void
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
}

export default class FocalLengthForm extends React.PureComponent<FocalLengthFormProps> {
  render() {
    let sensorWidth = this.props.cameraData.customSensorWidth
    let sensorHeight = this.props.cameraData.customSensorHeight
    let presetId = this.props.cameraData.presetId
    if (presetId !== null) {
      let preset = cameraPresets[presetId]
      sensorWidth = preset.sensorWidth
      sensorHeight = preset.sensorHeight
    }

    return (
      <div>
        <div className='panel-row'>
          <CameraPresetsDropdown
            cameraData={this.props.cameraData}
            onPresetChanged={this.props.onCameraPresetChange}
          />
        </div>
        <PanelSpacer />
        <div className='panel-row'>
          <NumericInputField
            isDisabled={presetId !== null}
            value={sensorWidth}
            onSubmit={(value: number) => { this.props.onSensorSizeChange(value, undefined) }} /> x
          <NumericInputField
            isDisabled={presetId !== null}
            value={sensorHeight}
            onSubmit={(value: number) => { this.props.onSensorSizeChange(undefined, value) }} /> mm
        </div>
        <PanelSpacer />
        <div className='panel-row'>
          Focal length <NumericInputField
            value={this.props.absoluteFocalLength}
            onSubmit={this.props.onAbsoluteFocalLengthChange}
          /> mm
        </div>
      </div>
    )
  }
}
