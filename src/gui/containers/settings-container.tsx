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
import { Dispatch } from 'redux'
import { AppAction, setCalibrationMode, setImageOpacity, setPrincipalPointMode1VP, setPrincipalPointMode2VP, setQuadModeEnabled, setReferenceDistanceUnit, setReferenceDistance, setReferenceDistanceAxis, setCameraPreset, setCameraSensorSize, setFirstVanishingPointAxis, setSecondVanishingPointAxis, setAbsoluteFocalLength1VP, setOverlay3DGuide } from '../actions'
import SettingsPanel from '../components/settings-panel/settings-panel'
import { CalibrationMode, GlobalSettings, Overlay3DGuide } from '../types/global-settings'
import { StoreState } from '../types/store-state'
import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode1VP, PrincipalPointMode2VP, Axis, ReferenceDistanceUnit, CalibrationSettingsBase } from '../types/calibration-settings'

export interface SettingsContainerProps {
  isVisible: boolean
  globalSettings: GlobalSettings
  calibrationSettingsBase: CalibrationSettingsBase
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP
  onCalibrationModeChange(calibrationMode: CalibrationMode): void
  onImageOpacityChange(opacity: number): void
  onOverlay3DGuideChange(overlay3DGuide: Overlay3DGuide): void
  onPrincipalPointModeChange1VP(principalPointMode: PrincipalPointMode1VP): void
  onPrincipalPointModeChange2VP(principalPointMode: PrincipalPointMode2VP): void
  onQuadModeEnabledChange(quadModeEnabled: boolean): void
  onFirstVanishingPointAxisChange(axis: Axis): void
  onSecondVanishingPointAxisChange(axis: Axis): void
  onAbsoluteFocalLengthChange1VP(absoluteFocalLength: number): void
  onReferenceDistanceAxisChange(axis: Axis | null): void
  onReferenceDistanceUnitChange(unit: ReferenceDistanceUnit): void
  onReferenceDistanceChange(distance: number): void
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
}

class SettingsContainer extends React.PureComponent<SettingsContainerProps> {
  render() {
    if (!this.props.isVisible) {
      return null
    }
    return (
      <SettingsPanel {...this.props} />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    globalSettings: state.globalSettings,
    calibrationSettingsBase: state.calibrationSettingsBase,
    calibrationSettings1VP: state.calibrationSettings1VP,
    calibrationSettings2VP: state.calibrationSettings2VP
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onCalibrationModeChange: (calibrationMode: CalibrationMode) => {
      dispatch(setCalibrationMode(calibrationMode))
    },
    onImageOpacityChange: (opacity: number) => {
      dispatch(setImageOpacity(opacity))
    },
    onOverlay3DGuideChange: (overlay3DGuide: Overlay3DGuide) => {
      dispatch(setOverlay3DGuide(overlay3DGuide))
    },
    onPrincipalPointModeChange1VP: (principalPointMode: PrincipalPointMode1VP) => {
      dispatch(setPrincipalPointMode1VP(principalPointMode))
    },
    onPrincipalPointModeChange2VP: (principalPointMode: PrincipalPointMode2VP) => {
      dispatch(setPrincipalPointMode2VP(principalPointMode))
    },
    onQuadModeEnabledChange: (quadModeEnabled: boolean) => {
      dispatch(setQuadModeEnabled(quadModeEnabled))
    },
    onFirstVanishingPointAxisChange: (axis: Axis) => {
      dispatch(setFirstVanishingPointAxis(axis))
    },
    onSecondVanishingPointAxisChange: (axis: Axis) => {
      dispatch(setSecondVanishingPointAxis(axis))
    },
    onAbsoluteFocalLengthChange1VP: (absoluteFocalLength: number) => {
      dispatch(setAbsoluteFocalLength1VP(absoluteFocalLength))
    },
    onReferenceDistanceAxisChange: (axis: Axis | null) => {
      dispatch(setReferenceDistanceAxis(axis))
    },
    onReferenceDistanceUnitChange: (unit: ReferenceDistanceUnit) => {
      dispatch(setReferenceDistanceUnit(unit))
    },
    onReferenceDistanceChange: (distance: number) => {
      dispatch(setReferenceDistance(distance))
    },
    onCameraPresetChange: (cameraPreset: string | null) => {
      dispatch(setCameraPreset(cameraPreset))
    },
    onSensorSizeChange: (width: number | undefined, height: number | undefined) => {
      dispatch(setCameraSensorSize(width, height))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
