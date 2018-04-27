import * as React from 'react';
import HorizonControl from './../components/horizon-control'
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import VanishingPointControl from './../components/vanishing-point-control'
import { StoreState } from '../types/store-state';
import { AppAction, adjustHorizon, setOrigin, setPrincipalPoint, adjustVanishingLine } from '../actions';
import { Dispatch, connect } from 'react-redux';
import { CalibrationMode } from '../types/global-settings';
import { ControlPointsState1VP, ControlPointsState2VP, Point2D, ControlPointPairIndex, ControlPointsStateBase, VanishingPointControlState, ControlPointPairState } from '../types/control-points-state';

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

  //common
  onPrincipalPointDrag(calibrationMode: CalibrationMode, position: Point2D): void
  onOriginDrag(calibrationMode: CalibrationMode, position: Point2D): void

  onVanishingPointControlPointDrag(
    calibrationMode: CalibrationMode,
    vanishingPointIndex: number,
    vanishingLineIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void

  //
  onHorizonDrag(
    calibrationMode: CalibrationMode,
    controlPointIndex:ControlPointPairIndex,
    position: Point2D
  ): void


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
          position={this.rel2AbsPoint(state.principalPoint)}
          dragCallback={(position: Point2D) => {
            this.invokeControlPointDragCallback(
              position,
              this.props.onPrincipalPointDrag
            )
          }}
        />
        <OriginControl
          position={this.rel2AbsPoint(state.origin)}
          dragCallback={(position: Point2D) => {
            this.invokeControlPointDragCallback(
              position,
              this.props.onOriginDrag
            )
          }}
        />
      </g>
    )
  }

  private render1VPControls() {
    let state = this.props.controlPointsState1VP
    return (
      <g>
        <VanishingPointControl
          color={"blue"}
          vanishingPointIndex={0}
          controlState={
            this.rel2AbsVanishingPointControlState(
              state.vanishingPoints[0]
            )
          }
          onControlPointDrag={(vanishingPointIndex: number, vanishingLineIndex: number, controlPointIndex: ControlPointPairIndex, position: Point2D) => {
            this.invokeVanishingLineEndpointDragCallback(
              vanishingPointIndex,
              vanishingLineIndex,
              controlPointIndex,
              position,
              this.props.onVanishingPointControlPointDrag
            )
          }}
        />
        <HorizonControl
          pointPair={
            this.rel2AbsControlPointPairState(
              this.props.controlPointsState1VP.horizon
            )
          }
          enabled={true}
          dragCallback={(controlPointIndex:ControlPointPairIndex, position: Point2D) => {
            this.invokeEndpointDragCallback(
              controlPointIndex,
              position,
              this.props.onHorizonDrag
            )
          }}
        />
      </g>
    )
  }

  private render2VPControls() {
    let state = this.props.controlPointsState2VP
    //TODO: render in a for loop
    //TODO: make a renderVanishingPoints method that renders a 1 or 3 tuple
    return (
      <g>
        <VanishingPointControl
          color={"red"}
          vanishingPointIndex={0}
          controlState={
            this.rel2AbsVanishingPointControlState(state.vanishingPoints[0])
          }
          onControlPointDrag={(vanishingPointIndex: number, vanishingLineIndex: number, controlPointIndex: number, position: Point2D) => {
            this.invokeVanishingLineEndpointDragCallback(
              vanishingPointIndex,
              vanishingLineIndex,
              controlPointIndex,
              position,
              this.props.onVanishingPointControlPointDrag
            )
          }}
        />
        <VanishingPointControl
          color={"green"}
          vanishingPointIndex={1}
          controlState={
            this.rel2AbsVanishingPointControlState(state.vanishingPoints[1])
          }
          onControlPointDrag={(vanishingPointIndex: number, vanishingLineIndex: number, controlPointIndex: number, position: Point2D) => {
            this.invokeVanishingLineEndpointDragCallback(
              vanishingPointIndex,
              vanishingLineIndex,
              controlPointIndex,
              position,
              this.props.onVanishingPointControlPointDrag
            )
          }}
        />
        <VanishingPointControl
          color={"orange"}
          vanishingPointIndex={2}
          controlState={
            this.rel2AbsVanishingPointControlState(state.vanishingPoints[2])
          }
          onControlPointDrag={(vanishingPointIndex: number, vanishingLineIndex: number, controlPointIndex: number, position: Point2D) => {
            this.invokeVanishingLineEndpointDragCallback(
              vanishingPointIndex,
              vanishingLineIndex,
              controlPointIndex,
              position,
              this.props.onVanishingPointControlPointDrag
            )
          }}
        />

      </g>
    )
  }

  private abs2Rel(abs: Point2D): Point2D {
    return {
      x: abs.x / this.props.width,
      y: abs.y / this.props.height
    }
  }

  private rel2AbsVanishingPointControlState(state: VanishingPointControlState): VanishingPointControlState {
    return {
      vanishingLines: [
        this.rel2AbsControlPointPairState(state.vanishingLines[0]),
        this.rel2AbsControlPointPairState(state.vanishingLines[1])
      ]
    }
  }

  private rel2AbsControlPointPairState(rel: ControlPointPairState): ControlPointPairState {
    return [
      this.rel2AbsPoint(rel[0]),
      this.rel2AbsPoint(rel[1])
    ]
  }

  private rel2AbsPoint(rel: Point2D): Point2D {
    return {
      x: rel.x * this.props.width,
      y: rel.y * this.props.height
    }
  }

  private invokeControlPointDragCallback(
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, position: Point2D) => void
  ) {
    callback(
      this.props.calibrationMode,
      this.abs2Rel(position)
    )
  }

  private invokeEndpointDragCallback(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, controlPointIndex: ControlPointPairIndex, position: Point2D) => void
  ) {
    callback(
      this.props.calibrationMode,
      controlPointIndex,
      this.abs2Rel(position)
    )
  }

  private invokeVanishingLineEndpointDragCallback(
    vanishingPointIndex:number,
    vanishingLineIndex:number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode,
      vanishingPointIndex:number,
      vanishingLineIndex:number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D) => void
  ) {
    callback(
      this.props.calibrationMode,
      vanishingPointIndex,
      vanishingLineIndex,
      controlPointIndex,
      this.abs2Rel(position)
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps) {
  let result = {
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    calibrationMode: state.globalSettings.calibrationMode
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
    onHorizonDrag: (calibrationMode: CalibrationMode, controlPointIndex:ControlPointPairIndex, position: Point2D) => {
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
