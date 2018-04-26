import * as React from 'react';
import HorizonControl from './../components/horizon-control'
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import VanishingPointControl from './../components/vanishing-point-control'
import { CalibrationMode, StoreState, ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase, Point2D } from '../types/store-state';
import { AppAction, setHorizonStartPosition, setHorizonEndPosition } from '../actions';
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

  onPrincipalPointDrag(is1VPMode: boolean, position: Point2D): void
  onOriginDrag(is1VPMode: boolean, position: Point2D): void

  onHorizonStartDrag(is1VPMode: boolean, position: Point2D): void
  onHorizonEndDrag(is1VPMode: boolean, position: Point2D): void

  onVanishingLine1StartDrag(is1VPMode: boolean, position: Point2D, vpIndex: number): void
  onVanishingLine1EndDrag(is1VPMode: boolean, position: Point2D, vpIndex: number): void
  onVanishingLine2StartDrag(is1VPMode: boolean, position: Point2D, vpIndex: number): void
  onVanishingLine2EndDrag(is1VPMode: boolean, position: Point2D, vpIndex: number): void
}

export class ControlPointsContainer extends React.PureComponent<ControlPointsContainerProps & ControlPointsContainerOwnProps> {
  render() {
    let svgStyle: React.CSSProperties = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
      position: "absolute",
      overflow: "visible"
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
          position={this.rel2Abs(state.principalPoint)}
          dragCallback={(position: Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onPrincipalPointDrag)
          }}
        />
        <OriginControl
          position={this.rel2Abs(state.origin)}
          dragCallback={(position: Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onOriginDrag)
          }}
        />
        <VanishingPointControl
          color={"blue"}
          vanishingLine1Start={this.rel2Abs(state.vanishingPointControl1.vanishingLine1Start)}
          vanishingLine1End={this.rel2Abs(state.vanishingPointControl1.vanishingLine1End)}
          vanishingLine2Start={this.rel2Abs(state.vanishingPointControl1.vanishingLine2Start)}
          vanishingLine2End={this.rel2Abs(state.vanishingPointControl1.vanishingLine2End)}
          vanishingLine1StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine1EndDragCallback={(position: Point2D) => {

          }}
          vanishingLine2StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine2EndDragCallback={(position: Point2D) => {

          }}
        />
      </g>
    )
  }

  private render1VPControls() {
    return (
      <g>
        <HorizonControl
          start={this.rel2Abs(this.props.controlPointsState1VP.horizonStart)}
          end={this.rel2Abs(this.props.controlPointsState1VP.horizonEnd)}
          enabled={true}
          startDragCallback={(position: Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onHorizonStartDrag)
          }}
          endDragCallback={(position: Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onHorizonEndDrag)
          }}
        />
      </g>
    )
  }

  private render2VPControls() {
    let state = this.props.controlPointsState2VP
    return (
      <g>
        <VanishingPointControl
          color={"red"}
          vanishingLine1Start={this.rel2Abs(state.vanishingPointControl2.vanishingLine1Start)}
          vanishingLine1End={this.rel2Abs(state.vanishingPointControl2.vanishingLine1End)}
          vanishingLine2Start={this.rel2Abs(state.vanishingPointControl2.vanishingLine2Start)}
          vanishingLine2End={this.rel2Abs(state.vanishingPointControl2.vanishingLine2End)}
          vanishingLine1StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine1EndDragCallback={(position: Point2D) => {

          }}
          vanishingLine2StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine2EndDragCallback={(position: Point2D) => {

          }}
        />
        <VanishingPointControl
          color={"orange"}
          vanishingLine1Start={this.rel2Abs(state.vanishingPointControl3.vanishingLine1Start)}
          vanishingLine1End={this.rel2Abs(state.vanishingPointControl3.vanishingLine1End)}
          vanishingLine2Start={this.rel2Abs(state.vanishingPointControl3.vanishingLine2Start)}
          vanishingLine2End={this.rel2Abs(state.vanishingPointControl3.vanishingLine2End)}
          vanishingLine1StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine1EndDragCallback={(position: Point2D) => {

          }}
          vanishingLine2StartDragCallback={(position: Point2D) => {

          }}
          vanishingLine2EndDragCallback={(position: Point2D) => {

          }}
        />

      </g>
    )
  }

  private get is1VPMode(): boolean {
    return this.props.calibrationMode == CalibrationMode.OneVanishingPoint
  }

  private abs2Rel(abs: Point2D): Point2D {
    return {
      x: abs.x / this.props.width,
      y: abs.y / this.props.height
    }
  }

  private rel2Abs(rel: Point2D): Point2D {
    return {
      x: rel.x * this.props.width,
      y: rel.y * this.props.height
    }
  }

  private invokeDragCallback(is1VPMode: boolean, position: Point2D, callback: (is1VPMode: boolean, position: Point2D) => void) {
    callback(
      is1VPMode,
      this.abs2Rel(position)
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps) {
  let result = {
    controlPointsState1VP: state.controlPointsStates.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsStates.controlPointsState2VP,
    calibrationMode: state.calibrationMode
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (is1VPMode: boolean, position: Point2D) => {
      console.log("onPrincipalPointDrag")
    },
    onOriginDrag: (is1VPMode: boolean, position: Point2D) => {
      console.log("onOriginDrag")
    },
    onHorizonStartDrag: (is1VPMode: boolean, position: Point2D) => {
      dispatch(setHorizonStartPosition(position))
    },
    onHorizonEndDrag: (is1VPMode: boolean, position: Point2D) => {
      dispatch(setHorizonEndPosition(position))
    },
    onVanishingLine1StartDrag: (is1VPMode: boolean, position: Point2D, vpIndex: number) => {
      console.log("onVanishingLine1StartDrag")
    },
    onVanishingLine1EndDrag: (is1VPMode: boolean, position: Point2D, vpIndex: number) => {
      console.log("onVanishingLine1StartDrag")
    },
    onVanishingLine2StartDrag: (is1VPMode: boolean, position: Point2D, vpIndex: number) => {
      console.log("onVanishingLine2StartDrag")
    },
    onVanishingLine2EndDrag: (is1VPMode: boolean, position: Point2D, vpIndex: number) => {
      console.log("onVanishingLine2EndDrag")
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);
