import * as React from 'react';
import ControlPointsPanel1VP from './../components/control-points-panel-1vp'
import ControlPointsPanel2VP from './../components/control-points-panel-2vp'

import { StoreState } from '../types/store-state';
import { AppAction, adjustHorizon, setOrigin, setPrincipalPoint, adjustVanishingLine } from '../actions';
import { Dispatch, connect } from 'react-redux';
import { CalibrationMode, GlobalSettings } from '../types/global-settings';
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointPairIndex } from '../types/control-points-state';
import { CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings';
import CalibrationResult from '../types/calibration-result';
import Point2D from '../solver/point-2d';

export interface ControlPointsContainerDimensionProps {
  left: number
  top: number
  width: number
  height: number
}

export interface ControlPointsContainerProps {
  globalSettings: GlobalSettings
  calibrationSettings1VP: CalibrationSettings1VP
  controlPointsState1VP: ControlPointsState1VP
  calibrationSettings2VP: CalibrationSettings2VP
  controlPointsState2VP: ControlPointsState2VP
  calibrationResult: CalibrationResult
}

export interface ControlPointsContainerCallbacks {
  onPrincipalPointDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onOriginDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onVanishingPointControlPointDrag(
    calibrationMode: CalibrationMode,
    vanishingPointIndex: number,
    vanishingLineIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
  onHorizonDrag(
    calibrationMode: CalibrationMode,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
}

export class ControlPointsContainer extends React.PureComponent<ControlPointsContainerProps & ControlPointsContainerCallbacks & ControlPointsContainerDimensionProps> {

  render() {
    let svgStyle: React.CSSProperties = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
      position: "absolute",
      overflow: "visible"
    }

    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let controlPointsPanel = is1VPMode ? (<ControlPointsPanel1VP {...this.props} />) :
                                         (<ControlPointsPanel2VP  {...this.props} />)
    return (
      <svg style={svgStyle}>
        {controlPointsPanel}
      </svg>
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerDimensionProps) {
  let result = {
    globalSettings: state.globalSettings,
    calibrationSettings1VP: state.calibrationSettings1VP,
    controlPointsState1VP: state.controlPointsState1VP,
    calibrationSettings2VP: state.calibrationSettings2VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationResult: state.calibrationResult
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setPrincipalPoint(calibrationMode, position))
    },
    onOriginDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setOrigin(calibrationMode, position))
    },
    onHorizonDrag: (calibrationMode: CalibrationMode, controlPointIndex: ControlPointPairIndex, position: Point2D) => {
      dispatch(adjustHorizon(controlPointIndex, position))
    },
    onVanishingPointControlPointDrag: (calibrationMode: CalibrationMode,
      vanishingPointIndex: number,
      vanishingLineIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D) => {
      dispatch(
        adjustVanishingLine(
          calibrationMode,
          vanishingPointIndex,
          vanishingLineIndex,
          controlPointIndex,
          position
        )
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);
