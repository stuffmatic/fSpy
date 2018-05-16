import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import CalibrationResult from '../types/calibration-result';
import { AppAction, setCalibrationResult, setExportDialogVisibility } from '../actions';
import { CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings';
import { ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state';
import { ImageState } from '../types/image-state';
import { StoreState } from '../types/store-state';
import { CalibrationMode } from '../types/global-settings';
import ResultPanel from '../components/result-panel/result-panel'
import Solver from '../solver/solver';

interface ResultContainerProps {
  isVisible: boolean
  calibrationMode: CalibrationMode
  calibrationSettings1VP: CalibrationSettings1VP
  controlPointsState1VP: ControlPointsState1VP

  calibrationSettings2VP: CalibrationSettings2VP
  controlPointsState2VP: ControlPointsState2VP

  image: ImageState
  onComputedResult(result: CalibrationResult): void
  onExportClicked(): void
}

class ResultContainer extends React.PureComponent<ResultContainerProps> {
  render() {
    if (!this.props.isVisible) {
      return null
    }

    //TODO: replace this horrible hack with redux thunk once
    //https://github.com/gaearon/redux-thunk/issues/169 is fixed

    let result: CalibrationResult = {
      calibrationResult1VP: Solver.solve1VP(
        this.props.calibrationSettings1VP,
        this.props.controlPointsState1VP,
        this.props.image
      ),
      calibrationResult2VP: Solver.solve2VP(
        this.props.calibrationSettings2VP,
        this.props.controlPointsState2VP,
        this.props.image
      )
    }

    this.props.onComputedResult(result)


    return (
      <ResultPanel
        solverResult={this.props.calibrationMode == CalibrationMode.OneVanishingPoint ? result.calibrationResult1VP : result.calibrationResult2VP}
        image={this.props.image}
        onExportClicked={this.props.onExportClicked}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    calibrationMode: state.globalSettings.calibrationMode,
    calibrationSettings1VP: state.calibrationSettings1VP,
    controlPointsState1VP: state.controlPointsState1VP,
    calibrationSettings2VP: state.calibrationSettings2VP,
    controlPointsState2VP: state.controlPointsState2VP,
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onComputedResult: (result: CalibrationResult) => {
      dispatch(setCalibrationResult(result))
    },
    onExportClicked: () => {
      dispatch(setExportDialogVisibility(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer);