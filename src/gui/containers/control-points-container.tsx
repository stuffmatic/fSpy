import * as React from 'react'
import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointPairIndex } from '../types/control-points-state'
import CalibrationResult from '../types/calibration-result'
import { connect, Dispatch } from 'react-redux'
import { GlobalSettings, CalibrationMode } from '../types/global-settings'
import ControlPointsPanel1VP from '../components/control-points-panel/control-points-panel-1-vp'
import Point2D from '../solver/point-2d'
import { AppAction, setPrincipalPoint, setOrigin, setReferenceDistanceAnchor, adjustHorizon, adjustVanishingPoint, adjustReferenceDistanceHandle } from '../actions'

export interface ControlPointsContainerCallbacks {
  onPrincipalPointDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onOriginDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onReferenceDistanceHandleDrag(calibrationMode: CalibrationMode, handleIndex: number, position: number): void
  onReferenceDistanceAnchorDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onVanishingPointControlPointDrag(
    calibrationMode: CalibrationMode,
    vanishingPointIndex: number,
    lineSegmentIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
  onHorizonDrag(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
}

interface ControlPointsContainerProps {
  imageState: ImageState
  globalSettings: GlobalSettings
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP
  calibrationResult: CalibrationResult
}

class ControlPointsContainer extends React.Component<ControlPointsContainerProps & ControlPointsContainerCallbacks> {
  render() {
    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let controlPointsState = is1VPMode ? this.props.controlPointsState1VP : this.props.controlPointsState2VP
    if (is1VPMode) {
      return (
        <ControlPointsPanel1VP
          imageState={this.props.imageState}
          callbacks={this.props} // callbacks is a subset of props
          globalSettings={this.props.globalSettings}
          controlPointsState={controlPointsState}
        />
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

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setPrincipalPoint(calibrationMode, position))
    },
    onOriginDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setOrigin(calibrationMode, position))
    },
    onReferenceDistanceHandleDrag: (calibrationMode: CalibrationMode, handleIndex: number, position: number) => {
      dispatch(adjustReferenceDistanceHandle(calibrationMode, handleIndex, position))
    },
    onReferenceDistanceAnchorDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setReferenceDistanceAnchor(
        calibrationMode, position
      ))
    },
    onVanishingPointControlPointDrag: (
      calibrationMode: CalibrationMode,
      vanishingPointIndex: number,
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(
        adjustVanishingPoint(calibrationMode, vanishingPointIndex, lineSegmentIndex, controlPointIndex, position)
      )
    },
    onHorizonDrag: (
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(adjustHorizon(controlPointIndex, position))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer)
