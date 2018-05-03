import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Solver from '../solver/solver';
import CalibrationResult from '../types/calibration-result';
import { AppAction, setCalibrationResult } from '../actions';
import { CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings';
import { ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state';
import { ImageState } from '../types/image-state';
import { StoreState } from '../types/store-state';
import { CalibrationMode } from '../types/global-settings';
import ResultPanel from '../components/result-panel/result-panel'

interface ResultContainerProps {
  calibrationMode:CalibrationMode
  calibrationSettings1VP: CalibrationSettings1VP
  controlPointsState1VP: ControlPointsState1VP

  calibrationSettings2VP: CalibrationSettings2VP
  controlPointsState2VP: ControlPointsState2VP

  image: ImageState
  onComputedResult(result: CalibrationResult): void
}

class ResultContainer extends React.PureComponent<ResultContainerProps> {
  render() {

    //TODO: move this somewhere else
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
      <div id="right-panel" className="side-panel">
        <ResultPanel
          calibrationMode={this.props.calibrationMode}
          calibrationResult={result}
        />
      </div>

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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer);