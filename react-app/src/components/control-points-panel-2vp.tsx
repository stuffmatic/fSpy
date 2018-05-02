import * as React from 'react';
import ControlPointsPanelBase from './control-points-panel-base';
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import VanishingPointControl from './../components/vanishing-point-control'
import CoordinatesUtil, { ImageCoordinateFrame } from '../solver/coordinates-util';
import Point2D from '../solver/point-2d';
import { PrincipalPointMode2VP } from '../types/calibration-settings';

export default class ControlPointsPanel2VP extends ControlPointsPanelBase {
  render() {
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
        <PrincipalPointControl
          position={
            CoordinatesUtil.convert(
              state.principalPoint,
              ImageCoordinateFrame.Relative,
              ImageCoordinateFrame.Absolute,
              this.props.width,
              this.props.height
            )
          }
          enabled= {true}
          dragCallback={(position: Point2D) => {
            this.invokeControlPointDragCallback(
              position,
              this.props.onPrincipalPointDrag
            )
          }}
        />
        <OriginControl
          position={
            CoordinatesUtil.convert(
              state.origin,
              ImageCoordinateFrame.Relative,
              ImageCoordinateFrame.Absolute,
              this.props.width,
              this.props.height
            )
          }
          dragCallback={(position: Point2D) => {
            this.invokeControlPointDragCallback(
              position,
              this.props.onOriginDrag
            )
          }}
        />

        <VanishingPointControl
          color={"green"}
          vanishingPointIndex={1}
          controlState={
            this.rel2AbsVanishingPointControlState(vp2Points)
          }
          vanishingPointPosition={null}
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
          vanishingPointPosition={null}
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

        {this.renderThirdVanishingPoint()}

      </g>
    )
  }

  protected renderThirdVanishingPoint() {

    let settings = this.props.calibrationSettings2VP
    let state = this.props.controlPointsState2VP
    if (settings.principalPointMode == PrincipalPointMode2VP.FromThirdVanishingPoint) {
      return (
        <g>
          <VanishingPointControl
            color={"orange"}
            vanishingPointIndex={2}
            controlState={
              this.rel2AbsVanishingPointControlState(state.vanishingPoints[2])
            }
            vanishingPointPosition={null}
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
    else {
      return null
    }
  }
}