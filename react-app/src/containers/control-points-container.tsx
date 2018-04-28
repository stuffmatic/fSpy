import * as React from 'react';
import HorizonControl from './../components/horizon-control'
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import VanishingPointControl from './../components/vanishing-point-control'
import { StoreState } from '../types/store-state';
import { AppAction, adjustHorizon, setOrigin, setPrincipalPoint, adjustVanishingLine, computeCalibrationResult } from '../actions';
import { Dispatch, connect } from 'react-redux';
import { CalibrationMode, GlobalSettings } from '../types/global-settings';
import { ControlPointsState1VP, ControlPointsState2VP, Point2D, ControlPointPairIndex, ControlPointsStateBase, VanishingPointControlState, ControlPointPairState } from '../types/control-points-state';
import { CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings';

export interface ControlPointsContainerOwnProps {
  left: number
  top: number
  width: number
  height: number
}

export interface ControlPointsContainerProps {
  globalSettings: GlobalSettings
  calibrationSettings1VP:CalibrationSettings1VP
  controlPointsState1VP: ControlPointsState1VP
  calibrationSettings2VP:CalibrationSettings2VP
  controlPointsState2VP: ControlPointsState2VP

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
    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint

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
          position={
            this.rel2AbsPoint(state.principalPoint)
          }
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
    let vp2Points = state.vanishingPoints[1]
    let quadModeEnabled = this.props.calibrationSettings2VP.quadModeEnabled
    if (quadModeEnabled) {
      vp2Points = {
        vanishingLines: [
          [
            state.vanishingPoints[0].vanishingLines[0][0],
            state.vanishingPoints[0].vanishingLines[1][0]
          ],
          [
            state.vanishingPoints[0].vanishingLines[0][1],
            state.vanishingPoints[0].vanishingLines[1][1]
          ]
        ]
      }
    }

    return (
      <g>
        <VanishingPointControl
          color={"green"}
          vanishingPointIndex={1}
          controlState={
            this.rel2AbsVanishingPointControlState(vp2Points)
          }
          onControlPointDrag={(vanishingPointIndex: number, vanishingLineIndex: number, controlPointIndex: number, position: Point2D) => {
            if (!quadModeEnabled) {
              this.invokeVanishingLineEndpointDragCallback(
                vanishingPointIndex,
                vanishingLineIndex,
                controlPointIndex,
                position,
                this.props.onVanishingPointControlPointDrag
              )
            }

          }}
        />

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
      this.props.globalSettings.calibrationMode,
      this.abs2Rel(position)
    )
  }

  private invokeEndpointDragCallback(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, controlPointIndex: ControlPointPairIndex, position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
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
      this.props.globalSettings.calibrationMode,
      vanishingPointIndex,
      vanishingLineIndex,
      controlPointIndex,
      this.abs2Rel(position)
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps) {
  let result = {
    globalSettings: state.globalSettings,
    calibrationSettings1VP: state.calibrationSettings1VP,
    controlPointsState1VP: state.controlPointsState1VP,
    calibrationSettings2VP: state.calibrationSettings2VP,
    controlPointsState2VP: state.controlPointsState2VP,
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setPrincipalPoint(calibrationMode, position))
      dispatch(computeCalibrationResult())
    },
    onOriginDrag: (calibrationMode: CalibrationMode, position: Point2D) => {
      dispatch(setOrigin(calibrationMode, position))
      dispatch(computeCalibrationResult())
    },
    onHorizonDrag: (calibrationMode: CalibrationMode, controlPointIndex:ControlPointPairIndex, position: Point2D) => {
      dispatch(adjustHorizon(controlPointIndex, position))
      dispatch(computeCalibrationResult())
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
        dispatch(computeCalibrationResult())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);
