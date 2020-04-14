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
import { SettingsContainerProps } from '../../containers/settings-container'
import { CalibrationMode, Overlay3DGuide } from '../../types/global-settings'
import Overlay3DGuideDropdown from './overlay-3d-guide-dropdown'
import { PrincipalPointMode1VP, PrincipalPointMode2VP } from '../../types/calibration-settings'
import Checkbox from './checkbox'
import PanelSpacer from './../common/panel-spacer'
import ReferenceDistanceForm from './reference-distance-form'
import AxisDropdown from './axis-dropdown'
import CameraPresetForm from './../common/camera-preset-form'
import Dropdown from '../common/dropdown'
import { Palette } from '../../style/palette'
import NumericInputField from '../common/numeric-input-field'
import { cameraPresets } from '../../solver/camera-presets'

export default class SettingsPanel extends React.PureComponent<SettingsContainerProps> {
  render() {
    return (
      <div id='left-panel' className='side-panel'>
        <div id='panel-container'>
          <div>
            <div className='panel-section bottom-border'>
              <div className='panel-group-title'>Number of vanishing points</div>
              <Dropdown
                options={[
                  {
                    value: CalibrationMode.OneVanishingPoint,
                    id: CalibrationMode.OneVanishingPoint,
                    title: '1'
                  },
                  {
                    value: CalibrationMode.TwoVanishingPoints,
                    id: CalibrationMode.TwoVanishingPoints,
                    title: '2'
                  }
                ]}
                selectedOptionId={this.props.globalSettings.calibrationMode}
                onOptionSelected={(selectedValue: CalibrationMode) => {
                  this.props.onCalibrationModeChange(selectedValue)
                }}
              />
            </div>
            <div className='panel-section'>
              <div className='panel-group-title'>
                Vanishing point axes
              </div>

              <div style={{ display: 'flex' }}>
                <span style={{ alignSelf: 'center', paddingRight: 6, paddingLeft: 4 }}>1</span><AxisDropdown
                  selectedAxis={this.props.calibrationSettingsBase.firstVanishingPointAxis}
                  onChange={this.props.onFirstVanishingPointAxisChange}
                />
              </div>
              <PanelSpacer />
              <div style={{ display: 'flex' }}>
                <span style={{ alignSelf: 'center', paddingRight: 6, paddingLeft: 4 }}>2</span><AxisDropdown
                  selectedAxis={this.props.calibrationSettingsBase.secondVanishingPointAxis}
                  onChange={this.props.onSecondVanishingPointAxisChange}
                />
              </div>
            </div>
            <div className='panel-section'>
              <div className='panel-group-title'>
                Reference distance
              </div>

              <ReferenceDistanceForm
                referenceAxis={this.props.calibrationSettingsBase.referenceDistanceAxis}
                referenceDistance={this.props.calibrationSettingsBase.referenceDistance}
                referenceDistanceUnit={this.props.calibrationSettingsBase.referenceDistanceUnit}
                onReferenceAxisChange={this.props.onReferenceDistanceAxisChange}
                onReferenceDistanceChange={this.props.onReferenceDistanceChange}
                onReferenceDistanceUnitChange={this.props.onReferenceDistanceUnitChange}
              />
            </div>
          </div>

          {this.renderModeSpecificSettings()}

          <div className='panel-section top-border'>
            <div className='panel-group-title'>
              3D guide
            </div>
            <Overlay3DGuideDropdown
              overlay3DGuide={this.props.globalSettings.overlay3DGuide}
              onChange={(overlay3DGuide: Overlay3DGuide) => {
                this.props.onOverlay3DGuideChange(overlay3DGuide)
              }}
            />
            <PanelSpacer />
            <Checkbox
              title={'Dim image'}
              isSelected={ this.props.globalSettings.imageOpacity < 1}
              onChange={(checked: boolean) => {
                this.props.onImageOpacityChange(checked ? 0.2 : 1)
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  private renderModeSpecificSettings() {
    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    return is1VPMode ? this.render1VPSettings() : this.render2VPSettings()
  }

  private render1VPSettings() {
    const presetId = this.props.calibrationSettingsBase.cameraData.presetId
    let presetFocalLength: number | undefined
    if (presetId !== null) {
      let preset = cameraPresets[presetId]
      presetFocalLength = preset.focalLength
    }

    let focalLengthValue = this.props.calibrationSettings1VP.absoluteFocalLength
    if (presetFocalLength !== undefined) {
      focalLengthValue = presetFocalLength
    }

    return (
      <div>
        <div className='panel-section'>
          <div className='panel-group-title'>
            Principal point
        </div>

          <Dropdown
            options={
              [
                {
                  value: PrincipalPointMode1VP.Default,
                  id: PrincipalPointMode1VP.Default,
                  title: 'Image midpoint',
                  circleColor: Palette.principalPointColor,
                  strokeCircle: true
                },
                {
                  value: PrincipalPointMode1VP.Manual,
                  id: PrincipalPointMode1VP.Manual,
                  title: PrincipalPointMode1VP.Manual,
                  circleColor: Palette.principalPointColor
                }
              ]
            }
            selectedOptionId={this.props.calibrationSettings1VP.principalPointMode}
            onOptionSelected={(selectedValue: PrincipalPointMode1VP) => {
              this.props.onPrincipalPointModeChange1VP(selectedValue)
            }}
          />
        </div>
        <div className='panel-section'>
          <div className='panel-group-title'>
            Camera data
        </div>
          <CameraPresetForm
            cameraData={this.props.calibrationSettingsBase.cameraData}
            absoluteFocalLength={this.props.calibrationSettings1VP.absoluteFocalLength}
            onCameraPresetChange={this.props.onCameraPresetChange}
            onSensorSizeChange={this.props.onSensorSizeChange}
          >
            <div>
            Focal length <NumericInputField
              precision={2}
              isDisabled={presetFocalLength !== undefined}
              value={ focalLengthValue }
              onSubmit={this.props.onAbsoluteFocalLengthChange1VP}
            /> mm
            <input disabled={ presetFocalLength !== undefined } style={{ width: '100%', marginTop: '7px' }} type='range' min='10' max='200' value={focalLengthValue} id='myRange' onChange={ (event) => {
              this.props.onAbsoluteFocalLengthChange1VP(parseFloat(event.target.value))
            }} />
          </div>
          </CameraPresetForm>
        </div>
      </div>
    )
  }

  private render2VPSettings() {
    return (
      <div>
        <div className='panel-section'>
          <div className='panel-group-title'>
            Principal point
        </div>
          <Dropdown
            options={
              [
                {
                  value: PrincipalPointMode2VP.Default,
                  id: PrincipalPointMode2VP.Default,
                  title: 'Image midpoint',
                  circleColor: Palette.principalPointColor,
                  strokeCircle: true
                },
                {
                  value: PrincipalPointMode2VP.Manual,
                  id: PrincipalPointMode2VP.Manual,
                  title: PrincipalPointMode2VP.Manual,
                  circleColor: Palette.principalPointColor
                },
                {
                  value: PrincipalPointMode2VP.FromThirdVanishingPoint,
                  id: PrincipalPointMode2VP.FromThirdVanishingPoint,
                  title: 'From 3rd vanishing point',
                  circleColor: Palette.principalPointColor,
                  strokeCircle: true
                }
              ]
            }
            selectedOptionId={this.props.calibrationSettings2VP.principalPointMode}
            onOptionSelected={(selectedValue: PrincipalPointMode2VP) => {
              this.props.onPrincipalPointModeChange2VP(selectedValue)
            }}
          />
        </div>
        <div className='panel-section'>
          <Checkbox
            title='Rectangle mode'
            isSelected={this.props.calibrationSettings2VP.quadModeEnabled}
            onChange={(isSelected: boolean) => this.props.onQuadModeEnabledChange(isSelected)}
          />
        </div>
      </div>
    )
  }
}
