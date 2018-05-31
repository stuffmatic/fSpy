import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppAction, setCalibrationMode, setImageOpacity, setPrincipalPointMode1VP, setPrincipalPointMode2VP, setHorizonMode, setQuadModeEnabled, setImageUrl, setVanishingPointAxis1VP, setVanishingPointAxis2VP, setGridFloorNormal, setReferenceDistanceUnit, setReferenceDistance, setReferenceDistanceAxis, setAbsoluteFocalLength1VP, setCameraPreset, setCameraSensorSize } from '../actions';
import SettingsPanel from '../components/settings-panel/settings-panel';
import { CalibrationMode, GlobalSettings } from '../types/global-settings';
import { StoreState } from '../types/store-state';
import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode1VP, PrincipalPointMode2VP, HorizonMode, Axis, ReferenceDistanceUnit } from '../types/calibration-settings';

export interface SettingsContainerProps {
  isVisible: boolean
  globalSettings: GlobalSettings
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP
  onCalibrationModeChange(calibrationMode: CalibrationMode): void
  onImageOpacityChange(opacity: number): void
  onGridFloorNormalChange(axis: Axis | null): void
  onHorizonModeChange(horizonMode: HorizonMode): void
  onPrincipalPointModeChange1VP(principalPointMode: PrincipalPointMode1VP): void
  onPrincipalPointModeChange2VP(principalPointMode: PrincipalPointMode2VP): void
  onQuadModeEnabledChange(quadModeEnabled: boolean): void
  onLoadTestImage(imageIndex: number | null): void
  onVanishingPointAxisChange1VP(axis: Axis): void
  onVanishingPointAxisChange2VP(vanishingPointIndex: number, axis: Axis): void
  onAbsoluteFocalLengthChange1VP(absoluteFocalLength: number): void
  onReferenceDistanceAxisChange(calibrationMode: CalibrationMode, axis: Axis | null): void
  onReferenceDistanceUnitChange(calibrationMode: CalibrationMode, unit: ReferenceDistanceUnit): void
  onReferenceDistanceChange(calibrationMode: CalibrationMode, distance: number): void
  onCameraPresetChange(calibrationMode: CalibrationMode, cameraPreset: string | null): void
  onSensorSizeChange(calibrationMode: CalibrationMode, width: number | undefined, height: number |  undefined): void
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
    onGridFloorNormalChange: (axis: Axis | null) => {
      dispatch(setGridFloorNormal(axis))
    },
    onHorizonModeChange: (horizonMode: HorizonMode) => {
      dispatch(setHorizonMode(horizonMode))
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
    onLoadTestImage: (imageIndex: number | null) => {
      let url = "omg fel url!"
      if (imageIndex != null) {
        url = [
          "https://upload.wikimedia.org/wikipedia/commons/f/f8/Tall_Palm_in_Napier.png",
          "https://image.freepik.com/free-photo/wide-road-with-buildings-on-either-side_1127-2188.jpg"
        ][imageIndex]
      }
      console.log("loading url " + url)
      dispatch(setImageUrl(url))
    },
    onVanishingPointAxisChange1VP: (axis: Axis): void => {
      dispatch(setVanishingPointAxis1VP(axis))
    },
    onVanishingPointAxisChange2VP: (vanishingPointIndex: number, axis: Axis) => {
      dispatch(setVanishingPointAxis2VP(vanishingPointIndex, axis))
    },
    onAbsoluteFocalLengthChange1VP: (absoluteFocalLength: number) => {
      dispatch(setAbsoluteFocalLength1VP(absoluteFocalLength))
    },
    onReferenceDistanceAxisChange: (calibrationMode: CalibrationMode, axis: Axis | null) => {
      dispatch(setReferenceDistanceAxis(calibrationMode, axis))
    },
    onReferenceDistanceUnitChange: (calibrationMode: CalibrationMode, unit: ReferenceDistanceUnit) => {
      dispatch(setReferenceDistanceUnit(calibrationMode, unit))
    },
    onReferenceDistanceChange: (calibrationMode: CalibrationMode, distance: number) => {
      dispatch(setReferenceDistance(calibrationMode, distance))
    },
    onCameraPresetChange: (calibrationMode: CalibrationMode, cameraPreset: string | null) => {
      dispatch(setCameraPreset(calibrationMode, cameraPreset))
    },
    onSensorSizeChange: (calibrationMode: CalibrationMode, width: number | undefined, height: number |  undefined) => {
      dispatch(setCameraSensorSize(calibrationMode, width, height))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);