import * as React from 'react'
import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointPairIndex, ControlPointsStateBase } from '../types/control-points-state'
import CalibrationResult from '../types/calibration-result'
import { connect, Dispatch } from 'react-redux'
import { GlobalSettings } from '../types/global-settings'
import ControlPointsPanel from '../components/control-points-panel/control-points-panel'
import Point2D from '../solver/point-2d'
import { AppAction, setPrincipalPoint, setOrigin, setReferenceDistanceAnchor, adjustHorizon, adjustReferenceDistanceHandle, adjustFirstVanishingPoint } from '../actions'
import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings'

export interface ControlPointsContainerCallbacks {
  onPrincipalPointDrag(position: Point2D): void
  onOriginDrag(position: Point2D): void
  onReferenceDistanceHandleDrag(handleIndex: number, position: number): void
  onReferenceDistanceAnchorDrag(position: Point2D): void
  onFirstVanishingPointControlPointDrag(
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

  calibrationSettingsBase: CalibrationSettingsBase
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP

  controlPointsStateBase: ControlPointsStateBase
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP
  calibrationResult: CalibrationResult
}

class ControlPointsContainer extends React.Component<ControlPointsContainerProps & ControlPointsContainerCallbacks> {
  render() {
    return (
      <ControlPointsPanel
        imageState={this.props.imageState}
        callbacks={this.props} // callbacks is a subset of props
        globalSettings={this.props.globalSettings}
        calibrationSettingsBase={this.props.calibrationSettingsBase}
        calbrationSettings1VP={this.props.calibrationSettings1VP}
        calbrationSettings2VP={this.props.calibrationSettings2VP}
        controlPointsStateBase={this.props.controlPointsStateBase}
        controlPointsState1VP={this.props.controlPointsState1VP}
        controlPointsState2VP={this.props.controlPointsState2VP}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    imageState: state.image,
    globalSettings: state.globalSettings,
    calibrationSettingsBase: state.calibrationSettingsBase,
    calibrationSettings1VP: state.calibrationSettings1VP,
    calibrationSettings2VP: state.calibrationSettings2VP,
    controlPointsStateBase: state.controlPointsStateBase,
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationResult: state.calibrationResult
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (position: Point2D) => {
      dispatch(setPrincipalPoint(position))
    },
    onOriginDrag: (position: Point2D) => {
      dispatch(setOrigin(position))
    },
    onReferenceDistanceHandleDrag: (handleIndex: number, position: number) => {
      dispatch(adjustReferenceDistanceHandle(handleIndex, position))
    },
    onReferenceDistanceAnchorDrag: (position: Point2D) => {
      dispatch(setReferenceDistanceAnchor(
        position
      ))
    },
    onFirstVanishingPointControlPointDrag: (
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(
        adjustFirstVanishingPoint(lineSegmentIndex, controlPointIndex, position)
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
