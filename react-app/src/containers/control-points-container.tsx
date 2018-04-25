import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { StoreState, ControlPointsState2VP, ControlPointsState1VP, CalibrationMode } from '../types/store-state';
import { AppAction, setPrincipalPointPosition } from '../actions';
import ControlPointsPanel1VP from '../components/control-points-panel-1vp';
import ControlPointsPanel2VP from '../components/control-points-panel-2vp';

interface ControlPointsContainerOwnProps {
  top: number
  left: number
  width: number
  height: number
}

interface ControlPointsContainerProps {
  calibrationMode: CalibrationMode
  controlPointsState: ControlPointsState1VP |  ControlPointsState2VP
}

function ControlPointsContainer(props: ControlPointsContainerProps & ControlPointsContainerOwnProps) {
  let is1VPMode = props.calibrationMode == CalibrationMode.OneVanishingPoint
  let panelProps = {
    left: props.left,
    top: props.top,
    width: props.width,
    height: props.height,
    x: props.controlPointsState.principalPoint.x,
    y: props.controlPointsState.principalPoint.y,
    onPrincipalPointDrag: () => { }
  }
  if (is1VPMode) {
    return (
      <ControlPointsPanel1VP {...panelProps} />
    )
  }
  else {
    return (
      <ControlPointsPanel2VP {...panelProps} />
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps): ControlPointsContainerProps {
  let is1VPMode = state.calibrationMode == CalibrationMode.OneVanishingPoint
  let result = {
    controlPointsState: is1VPMode ? state.controlPointsState1VP : state.controlPointsState2VP,
    calibrationMode: state.calibrationMode
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (x: number, y: number) => dispatch(setPrincipalPointPosition(x, y)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);