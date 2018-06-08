import * as React from 'react'
import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import { ControlPointsState1VP, ControlPointsState2VP } from '../types/control-points-state'
import CalibrationResult from '../types/calibration-result'
import { connect } from 'react-redux'
import { GlobalSettings, CalibrationMode } from '../types/global-settings'
import ControlPointsPanel1VP from '../components/control-points-panel/control-points-panel-1-vp'

interface ControlPointsContainerProps {
  imageState: ImageState
  globalSettings: GlobalSettings
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP
  calibrationResult: CalibrationResult
}

class ControlPointsContainer extends React.Component<ControlPointsContainerProps> {
  render() {
    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    if (is1VPMode) {
      return (
        <ControlPointsPanel1VP imageState={this.props.imageState} />
      )
    } else {
      return (<div>TODO: add 2 vp mode panel</div>)
    }
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    imageState: state.image,
    globalSettings: state.globalSettings,
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationResult: state.calibrationResult
  }
}

export default connect(mapStateToProps, null)(ControlPointsContainer)
