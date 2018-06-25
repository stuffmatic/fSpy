import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { AppAction, setExportDialogVisibility, setCameraPreset, setCameraSensorSize } from '../actions'

import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import ResultPanel from '../components/result-panel/result-panel'
import { SolverResult } from '../solver/solver-result'
import { CalibrationSettingsBase } from '../types/calibration-settings'
import { GlobalSettings } from '../types/global-settings'

interface ResultContainerProps {
  isVisible: boolean
  globalSettings: GlobalSettings
  calibrationSettings: CalibrationSettingsBase
  solverResult: SolverResult
  image: ImageState

  onExportClicked(): void
  onCameraPresetChange(cameraPreset: string | null): void
  onSensorSizeChange(width: number | undefined, height: number | undefined): void
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
        image={this.props.image}
        onExportClicked={this.props.onExportClicked}
        onCameraPresetChange={this.props.onCameraPresetChange}
        onSensorSizeChange={this.props.onSensorSizeChange}
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
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onExportClicked: () => {
      dispatch(setExportDialogVisibility(true))
    },
    onCameraPresetChange: (cameraPreset: string | null) => {
      dispatch(setCameraPreset(cameraPreset))
    },
    onSensorSizeChange: (width: number | undefined, height: number | undefined) => {
      dispatch(setCameraSensorSize(width, height))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer)
