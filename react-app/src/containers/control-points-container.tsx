import * as React from 'react';

import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import { CalibrationMode, StoreState, ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase } from '../types/store-state';
import { AppAction } from '../actions';
import { Dispatch, connect } from 'react-redux';

export interface ControlPointsContainerOwnProps {
  left: number
  top: number
  width: number
  height: number
}

export interface ControlPointsContainerProps {
  calibrationMode: CalibrationMode
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP

  onPrincipalPointDrag(calibrationMode: CalibrationMode, xRelative: number, yRelative: number): void
  onOriginDrag(calibrationMode: CalibrationMode, xRelative: number, yRelative: number): void

  onHorizonStartDrag(xRelative: number, yRelative: number): void
  onHorizonEndDrag(xRelative: number, yRelative: number): void
}

class ControlPointsContainer extends React.PureComponent<ControlPointsContainerProps & ControlPointsContainerOwnProps> {
  render() {
    let svgStyle: React.CSSProperties = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
      position: "absolute"
    }
    let is1VPMode = this.props.calibrationMode == CalibrationMode.OneVanishingPoint
    return (
      <svg style={svgStyle}>
        {this.renderCommonControls(is1VPMode ? this.props.controlPointsState1VP : this.props.controlPointsState2VP)}
        {is1VPMode ? this.render1VPControls() : this.render2VPControls()}
      </svg>
    )
  }

  private renderCommonControls(state: ControlPointsStateBase) {
    return (
      <g>
        <PrincipalPointControl
          x={state.principalPoint.x * this.props.width}
          y={state.principalPoint.y * this.props.height}
          dragCallback={(x: number, y: number) => {
            this.invokeDragCallback(this.props.calibrationMode, x, y, this.props.onPrincipalPointDrag)
          }}
        />
        <OriginControl
          x={0.5 * state.origin.x * this.props.width}
          y={0.5 * state.origin.y * this.props.height}
          dragCallback={(x: number, y: number) => {
            this.invokeDragCallback(this.props.calibrationMode, x, y, this.props.onOriginDrag)
          }}
        />
      </g>
    )
  }

  private render1VPControls() {
    <g>

    </g>
  }

  private render2VPControls() {
    return (
      <g>


      </g>
    )
  }

  private invokeDragCallback(calibrationMode: CalibrationMode, xAbsolute: number, yAbsolute: number, callback: (calibrationMode: CalibrationMode, xRelative: number, yRelative: number) => void) {
    callback(
      calibrationMode,
      xAbsolute / this.props.width,
      yAbsolute / this.props.height
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps) {
  let result = {
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationMode: state.calibrationMode
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (calibrationMode: CalibrationMode, xRelative: number, yRelative: number) => {
      console.log("onPrincipalPointDrag")
    },
    onOriginDrag: (calibrationMode: CalibrationMode, xRelative: number, yRelative: number) => {
      console.log("onOriginDrag")
    },
    onHorizonStartDrag: (xRelative: number, yRelative: number) => {
      console.log("onHorizonStartDrag")
    },
    onHorizonEndDrag: (xRelative: number, yRelative: number) => {
      console.log("onHorizonEndDrag")
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);
