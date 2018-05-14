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
        lineSegments: [
          [
            state.vanishingPoints[0].lineSegments[0][0],
            state.vanishingPoints[0].lineSegments[1][0]
          ],
          [
            state.vanishingPoints[0].lineSegments[0][1],
            state.vanishingPoints[0].lineSegments[1][1]
          ]
        ]
      }
    }

    let principalPoint:Point2D | null = null
    switch (this.props.calibrationSettings2VP.principalPointMode) {
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        principalPoint = this.props.calibrationResult.calibrationResult2VP.principalPoint
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
            this.props.calibrationSettings2VP.principalPointMode == PrincipalPointMode2VP.Manual,
            this.props.calibrationSettings2VP.principalPointMode != PrincipalPointMode2VP.Default
          )
        }
        { this.renderOriginControl(state.origin) }
        { this.renderReferenceDistanceAnchorControl(state.referenceDistanceAnchor) }

        <VanishingPointControl
          color={Palette.colorForAxis(this.props.calibrationSettings2VP.vanishingPointAxes[1])}
          vanishingPointIndex={1}
          controlState={
            this.rel2AbsVanishingPointControlState(vp2Points)
          }
          vanishingPoint={this.props.calibrationResult.calibrationResult2VP.vanishingPoints ? this.imgPlane2AbsPoint(this.props.calibrationResult.calibrationResult2VP.vanishingPoints[1]) : null}
          onControlPointDrag={(vanishingPointIndex: number, lineSegmentIndex: number, controlPointIndex: number, position: Point2D) => {
            if (!quadModeEnabled) {
              this.invokeVanishingPointDragCallback(
                vanishingPointIndex,
                lineSegmentIndex,
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
          vanishingPoint={this.props.calibrationResult.calibrationResult2VP.vanishingPoints ? this.imgPlane2AbsPoint(this.props.calibrationResult.calibrationResult2VP.vanishingPoints[0]) : null}
          onControlPointDrag={(vanishingPointIndex: number, lineSegmentIndex: number, controlPointIndex: number, position: Point2D) => {
            this.invokeVanishingPointDragCallback(
              vanishingPointIndex,
              lineSegmentIndex,
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
            vanishingPoint={this.props.calibrationResult.calibrationResult2VP.vanishingPoints ? this.imgPlane2AbsPoint(this.props.calibrationResult.calibrationResult2VP.vanishingPoints[2]) : null}
            onControlPointDrag={(vanishingPointIndex: number, lineSegmentIndex: number, controlPointIndex: number, position: Point2D) => {
              this.invokeVanishingPointDragCallback(
                vanishingPointIndex,
                lineSegmentIndex,
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