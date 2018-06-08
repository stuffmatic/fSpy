import * as React from 'react'
import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import { ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state'
import CalibrationResult from '../types/calibration-result'
import ControlPointsPanel from '../components/control-points-panel/control-points-panel'
import { connect } from 'react-redux'

interface ControlPointsContainerProps {
  imageState: ImageState
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP
  calibrationResult: CalibrationResult
}

class ControlPointsContainer extends React.Component<ControlPointsContainerProps> {
  render() {
    return (
      <ControlPointsPanel imageState={this.props.imageState} />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    imageState: state.image,
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationResult: state.calibrationResult
  }
}

export default connect(mapStateToProps, null)(ControlPointsContainer)
