import * as React from 'react';
import ControlPointsPanelBase from './control-points-panel-base';
import VanishingPointControl from './vanishing-point-control'
import Point2D from '../../solver/point-2d';
import { PrincipalPointMode2VP } from '../../types/calibration-settings';
import { Palette } from '../../style/palette';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';

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

    let principalPoint:Point2D | null = null
    switch (this.props.calibrationSettings2VP.principalPointMode) {
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        principalPoint = this.props.calibrationResult.calibrationResult2VP.cameraParameters.computedPrincipalPoint
        if (principalPoint) {
          principalPoint = CoordinatesUtil.convert(
            principalPoint,
            ImageCoordinateFrame.ImagePlane,
            ImageCoordinateFrame.Relative,
            this.props.width,
            this.props.height
          )
        }
        break
      case PrincipalPointMode2VP.Manual:
        principalPoint = state.principalPoint
        break
      default:
        principalPoint = null
    }

    return (
      <g>
        {
          this.renderPrincipalPointControl(
            principalPoint!,
            this.props.calibrationSettings2VP.principalPointMode == PrincipalPointMode2VP.Manual
          )
        }
        {
          this.renderOriginControl(state.origin)
        }

        <VanishingPointControl
          color={Palette.colorForAxis(this.props.calibrationSettings2VP.vanishingPointAxes[1])}
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
          color={Palette.colorForAxis(this.props.calibrationSettings2VP.vanishingPointAxes[0])}
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
            color={Palette.orange}
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
    else {
      return null
    }
  }
}