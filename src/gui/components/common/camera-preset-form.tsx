/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
