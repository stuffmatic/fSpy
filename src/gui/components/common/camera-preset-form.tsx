import * as React from 'react'
import CameraPresetsDropdown from './../common/camera-presets-dropdown'
import NumericInputField from './../common/numeric-input-field'
import PanelSpacer from './../common/panel-spacer'
import { CameraData } from '../../types/calibration-settings'
import strings from '../../strings/strings'
import { cameraPresets } from '../../solver/camera-presets'

export interface CameraPresetFormProps {
  absoluteFocalLength: number
  cameraData: CameraData
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
}

export default class CameraPresetForm extends React.PureComponent<CameraPresetFormProps> {
  render() {
    let sensorWidth = this.props.cameraData.customSensorWidth
    let sensorHeight = this.props.cameraData.customSensorHeight
    let presetId = this.props.cameraData.presetId
    if (presetId != null) {
      const preset = cameraPresets[presetId]
      if (preset) {
        sensorWidth = preset.sensorWidth
        sensorHeight = preset.sensorHeight
      }
    }

    return (
      <div>
        <CameraPresetsDropdown
          cameraData={this.props.cameraData}
          onPresetChanged={this.props.onCameraPresetChange}
        />
        <PanelSpacer />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Sensor <NumericInputField
          isDisabled={presetId !== null}
          value={sensorWidth}
          onSubmit={(value: number) => { this.props.onSensorSizeChange(value, undefined) }} />
        x
        <NumericInputField
          isDisabled={presetId !== null}
          value={sensorHeight}
          onSubmit={(value: number) => { this.props.onSensorSizeChange(undefined, value) }} /> {strings.unitMm}
        </div>
        <PanelSpacer />

        { this.props.children }
      </div>
    )
  }
}
