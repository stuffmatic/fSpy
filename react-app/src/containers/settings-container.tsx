import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppAction, setCalibrationMode, setImageOpacity, setPrincipalPointMode1VP, setPrincipalPointMode2VP, setHorizonMode, setQuadModeEnabled, setImageUrl, setNotes } from '../actions';
import SettingsPanel from '../components/settings-panel/settings-panel';
import { CalibrationMode, GlobalSettings } from '../types/global-settings';
import { StoreState } from '../types/store-state';
import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode1VP, PrincipalPointMode2VP, HorizonMode } from '../types/calibration-settings';

export interface SettingsContainerProps {
  globalSettings: GlobalSettings
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP
  onCalibrationModeChange(calibrationMode: CalibrationMode): void
  onImageOpacityChange(opacity: number): void
  onNotesChange(notes: string): void
  onHorizonModeChange(horizonMode: HorizonMode): void
  onPrincipalPointModeChange1VP(principalPointMode: PrincipalPointMode1VP): void
  onPrincipalPointModeChange2VP(principalPointMode: PrincipalPointMode2VP): void
  onQuadModeEnabledChange(quadModeEnabled: boolean): void
  onLoadTestImage(imageIndex: number | null): void
}

class SettingsContainer extends React.PureComponent<SettingsContainerProps> {
  render() {
    return (
      <SettingsPanel { ...this.props }/>
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
    onNotesChange: (notes: string) => {
      dispatch(setNotes(notes))
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);