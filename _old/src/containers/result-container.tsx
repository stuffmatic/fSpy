import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import CalibrationResult from '../types/calibration-result';
import { AppAction, setExportDialogVisibility } from '../actions';

import { ImageState } from '../types/image-state';
import { StoreState } from '../types/store-state';
import { CalibrationMode } from '../types/global-settings';
import ResultPanel from '../components/result-panel/result-panel'

interface ResultContainerProps {
  isVisible: boolean
  calibrationMode:CalibrationMode
  calibrationResult:CalibrationResult
  image: ImageState

  onExportClicked(): void
}

class ResultContainer extends React.PureComponent<ResultContainerProps> {
  render() {
    if (!this.props.isVisible) {
      return null
    }

    let is1VP = this.props.calibrationMode == CalibrationMode.OneVanishingPoint
    let solverResult = is1VP ? this.props.calibrationResult.calibrationResult1VP : this.props.calibrationResult.calibrationResult2VP

    return (
      <ResultPanel
        solverResult={solverResult}
        image={this.props.image}
        onExportClicked={this.props.onExportClicked}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    calibrationMode: state.globalSettings.calibrationMode,
    calibrationResult: state.calibrationResult,
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onExportClicked: () => {
      dispatch(setExportDialogVisibility(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer);