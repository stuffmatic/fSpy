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
import TableRow from './table-row'
import BulletList, { BulletListType } from './bullet-list'
import { ImageState } from '../../types/image-state'
import { SolverResult } from '../../solver/solver-result'
import CameraPresetForm from '../common/camera-preset-form'
import { CalibrationSettingsBase, CameraData } from '../../types/calibration-settings'
import { cameraPresets } from '../../solver/camera-presets'
import { GlobalSettings, CalibrationMode } from '../../types/global-settings'
import Dropdown from '../common/dropdown'
import { FieldOfViewFormat, OrientationFormat, PrincipalPointFormat, ResultDisplaySettings } from '../../types/result-display-settings'
import MathUtil from '../../solver/math-util'
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util'
import Checkbox from '../settings-panel/checkbox'
import Solver from '../../solver/solver'
import strings from '../../strings/strings'

interface ResultPanelProps {
  globalSettings: GlobalSettings
  calibrationSettings: CalibrationSettingsBase
  solverResult: SolverResult
  resultDisplaySettings: ResultDisplaySettings
  image: ImageState
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
  onFieldOfViewDisplayFormatChanged(displayFormat: FieldOfViewFormat): void
  onOrientationDisplayFormatChanged(displayFormat: OrientationFormat): void
  onDisplayAbsoluteFocalLengthChanged(enabled: boolean): void
  onPrincipalPointDisplayFormatChanged(displayFormat: PrincipalPointFormat): void
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

    return (
      <div>
        <div className='panel-section bottom-border'>
          <div className='panel-group-title'>Image</div>
          <TableRow
            title={'Width'}
            value={this.props.image.width}
          />
          <TableRow
            isLastRow={true}
            title={'Height'}
            value={this.props.image.height}
          />
        </div>
        {this.renderFieldOfViewSection()}
        <div className='panel-section bottom-border'>
          <div className='panel-group-title'>Camera position</div>
          <TableRow
            title={'x'}
            value={cameraParameters.cameraTransform.matrix[0][3]}
          />
          <TableRow
            title={'y'}
            value={cameraParameters.cameraTransform.matrix[1][3]}
          />
          <TableRow
            isLastRow={true}
            title={'z'}
            value={cameraParameters.cameraTransform.matrix[2][3]}
          />
        </div>
        { this.renderOrientationSection() }
        { this.renderPrincipalPointSection() }
        { this.renderFocalLengthSection() }
        {this.renderWarnings()}
      </div>
    )
  }

  private renderFieldOfViewSection() {
    if (!this.props.solverResult.cameraParameters) {
      return null
    }
    const displayDegrees = this.props.resultDisplaySettings.fieldOfViewFormat == FieldOfViewFormat.Degrees
    const fovFactor = displayDegrees ? 180 / Math.PI : 1
    return (
      <div className='panel-section bottom-border'>
        <div className='panel-group-title'>Field of view</div>
        <Dropdown
          options={[
            { id: FieldOfViewFormat.Degrees, title: 'Degrees', value: FieldOfViewFormat.Degrees },
            { id: FieldOfViewFormat.Radians, title: 'Radians', value: FieldOfViewFormat.Radians }
          ]}
          selectedOptionId={this.props.resultDisplaySettings.fieldOfViewFormat}
          onOptionSelected={this.props.onFieldOfViewDisplayFormatChanged}
        />
        <TableRow
          isFirstRow={true}
          title={'Horizontal'}
          value={fovFactor * this.props.solverResult.cameraParameters.horizontalFieldOfView}
        />
        <TableRow
          isLastRow={true}
          title={'Vertical'}
          value={fovFactor * this.props.solverResult.cameraParameters.verticalFieldOfView }
        />
      </div>
    )
  }

  private renderOrientationSection() {
    if (!this.props.solverResult.cameraParameters) {
      return null
    }
    const displayFormat = this.props.resultDisplaySettings.orientationFormat
    const displayAxisAngle = displayFormat != OrientationFormat.Quaterion
    const cameraTransform = this.props.solverResult.cameraParameters.cameraTransform
    const components = displayAxisAngle ? MathUtil.matrixToAxisAngle(cameraTransform) : MathUtil.matrixToQuaternion(cameraTransform)
    if (displayFormat == OrientationFormat.AxisAngleDegrees) {
      components[3] = 180 * components[3] / Math.PI
    }

    return (
      <div className='panel-section bottom-border'>
          <div className='panel-group-title'>Camera orientation</div>
          <Dropdown
            options={[
              { id: OrientationFormat.AxisAngleDegrees, title: 'Axis angle (degrees)', value: OrientationFormat.AxisAngleDegrees },
              { id: OrientationFormat.AxisAngleRadians, title: 'Axis angle (radians)', value: OrientationFormat.AxisAngleRadians },
              { id: OrientationFormat.Quaterion, title: 'Quaternion', value: OrientationFormat.Quaterion }
            ]}
            selectedOptionId={this.props.resultDisplaySettings.orientationFormat}
            onOptionSelected={this.props.onOrientationDisplayFormatChanged}
          />
          <TableRow
            isFirstRow={true}
            title={'x'}
            value={components[0]}
          />
          <TableRow
            title={'y'}
            value={components[1]}
          />
          <TableRow
            title={'z'}
            value={components[2]}
          />
          <TableRow
            isLastRow={true}
            title={displayAxisAngle ? 'Angle' : 'w'}
            value={components[3]}
          />
        </div>
    )
  }

  private renderPrincipalPointSection() {
    if (!this.props.solverResult.cameraParameters) {
      return null
    }
    const cameraParameters = this.props.solverResult.cameraParameters
    let displayPosition = this.props.solverResult.cameraParameters.principalPoint
    switch (this.props.resultDisplaySettings.principalPointFormat) {
      case PrincipalPointFormat.Absolute:
        displayPosition = CoordinatesUtil.convert(
          displayPosition,
          ImageCoordinateFrame.ImagePlane,
          ImageCoordinateFrame.Absolute,
          cameraParameters.imageWidth,
          cameraParameters.imageHeight
        )
        break
      case PrincipalPointFormat.Relative:
        displayPosition = CoordinatesUtil.convert(
          displayPosition,
          ImageCoordinateFrame.ImagePlane,
          ImageCoordinateFrame.Relative,
          cameraParameters.imageWidth,
          cameraParameters.imageHeight
        )
        break
    }

    return (
      <div className='panel-section bottom-border'>
          <div className='panel-group-title'>Principal point</div>
          <Dropdown
            options={[
              { id: PrincipalPointFormat.Absolute, title: 'Absolute', value: PrincipalPointFormat.Absolute },
              { id: PrincipalPointFormat.Relative, title: 'Relative', value: PrincipalPointFormat.Relative }
            ]}
            selectedOptionId={this.props.resultDisplaySettings.principalPointFormat}
            onOptionSelected={this.props.onPrincipalPointDisplayFormatChanged}
          />
          <TableRow
            isFirstRow={true}
            title={'x'}
            value={displayPosition.x}
          />
          <TableRow
            isLastRow={true}
            title={'y'}
            value={displayPosition.y}
          />
        </div>
    )
  }

  private renderFocalLengthSection() {
    let cameraParameters = this.props.solverResult.cameraParameters
    if (!cameraParameters) {
      return null
    }

    if (this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint) {
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

    const displayFocalLength = this.props.resultDisplaySettings.displayAbsoluteFocalLength
    const proportionsMatch = Solver.imageProportionsMatchSensor(
      cameraParameters.imageWidth,
      cameraParameters.imageHeight,
      sensorWidth,
      sensorHeight
    )

    return (
      <div className='panel-section bottom-border'>
        <div style={{ marginTop: '-2px' }}><Checkbox
          title='Focal length'
          isSelected={displayFocalLength}
          onChange={ (enabled: boolean) => { this.props.onDisplayAbsoluteFocalLengthChanged(enabled) } }
        /></div>
        { displayFocalLength ? this.renderCameraPresetForm(absoluteFocalLength, cameraData) : null }
        { !proportionsMatch && displayFocalLength ? (<div style={{ marginTop: '5px' }}><BulletList
          messages={
            [ strings.imageSensorProportionsMismatch ]
          }
          type={BulletListType.Warnings}
        /></div>) : null }
      </div>
    )
  }

  private renderCameraPresetForm(absoluteFocalLength: number, cameraData: CameraData) {
    return (
      <div style={{ marginTop: '5px' }}>
      <CameraPresetForm
            absoluteFocalLength={absoluteFocalLength}
            cameraData={cameraData}
            onCameraPresetChange={this.props.onCameraPresetChange}
            onSensorSizeChange={this.props.onSensorSizeChange}
          >
        <TableRow value={absoluteFocalLength} title='Value (mm)' />
      </CameraPresetForm>
      </div>
    )
  }

  private renderWarnings() {
    if (this.props.solverResult.warnings.length == 0) {
      return null
    }
    return (
      <div className='panel-section'>
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
