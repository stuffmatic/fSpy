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
import { connect } from 'react-redux'

import { AppAction, setCameraPreset, setCameraSensorSize, setFieldOfViewDisplayFormat, setOrientationDisplayFormat, setPrincipalPointDisplayFormat, SetDisplayAbsoluteFocalLength } from '../actions'

import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import ResultPanel from '../components/result-panel/result-panel'
import { SolverResult } from '../solver/solver-result'
import { CalibrationSettingsBase } from '../types/calibration-settings'
import { GlobalSettings } from '../types/global-settings'
import { FieldOfViewFormat, OrientationFormat, PrincipalPointFormat, ResultDisplaySettings } from '../types/result-display-settings'
import { Dispatch } from 'redux'

interface ResultContainerProps {
  isVisible: boolean
  globalSettings: GlobalSettings
  calibrationSettings: CalibrationSettingsBase
  solverResult: SolverResult
  resultDisplaySettings: ResultDisplaySettings
  image: ImageState

  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
  onFieldOfViewDisplayFormatChanged(displayFormat: FieldOfViewFormat): void
  onOrientationDisplayFormatChanged(displayFormat: OrientationFormat): void
  onPrincipalPointDisplayFormatChanged(displayFormat: PrincipalPointFormat): void
  onDisplayAbsoluteFocalLengthChanged(enabled: boolean): void
}

class ResultContainer extends React.PureComponent<ResultContainerProps> {
  render() {
    if (!this.props.isVisible) {
      return null
    }

    return (
      <ResultPanel
        globalSettings={this.props.globalSettings}
        calibrationSettings={this.props.calibrationSettings}
        solverResult={this.props.solverResult}
        resultDisplaySettings={this.props.resultDisplaySettings}
        image={this.props.image}
        onCameraPresetChange={this.props.onCameraPresetChange}
        onSensorSizeChange={this.props.onSensorSizeChange}
        onFieldOfViewDisplayFormatChanged={this.props.onFieldOfViewDisplayFormatChanged}
        onOrientationDisplayFormatChanged={this.props.onOrientationDisplayFormatChanged}
        onPrincipalPointDisplayFormatChanged={this.props.onPrincipalPointDisplayFormatChanged}
        onDisplayAbsoluteFocalLengthChanged={this.props.onDisplayAbsoluteFocalLengthChanged}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    globalSettings: state.globalSettings,
    calibrationSettings: state.calibrationSettingsBase,
    calibrationMode: state.globalSettings.calibrationMode,
    solverResult: state.solverResult,
    resultDisplaySettings: state.resultDisplaySettings,
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onCameraPresetChange: (cameraPreset: string | null) => {
      dispatch(setCameraPreset(cameraPreset))
    },
    onSensorSizeChange: (width: number | undefined, height: number | undefined) => {
      dispatch(setCameraSensorSize(width, height))
    },
    onFieldOfViewDisplayFormatChanged: (displayFormat: FieldOfViewFormat) => {
      dispatch(setFieldOfViewDisplayFormat(displayFormat))
    },
    onOrientationDisplayFormatChanged: (displayFormat: OrientationFormat) => {
      dispatch(setOrientationDisplayFormat(displayFormat))
    },
    onPrincipalPointDisplayFormatChanged: (displayFormat: PrincipalPointFormat) => {
      dispatch(setPrincipalPointDisplayFormat(displayFormat))
    },
    onDisplayAbsoluteFocalLengthChanged: (enabled: boolean) => {
      dispatch(SetDisplayAbsoluteFocalLength(enabled))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer)
