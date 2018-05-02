import * as React from 'react';
import ControlPointsPanelBase from './control-points-panel-base';
import Point2D from '../solver/point-2d';
import CoordinatesUtil, { ImageCoordinateFrame } from '../solver/coordinates-util';
import HorizonControl from './../components/horizon-control'
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import VanishingPointControl from './../components/vanishing-point-control'
import { ControlPointPairIndex } from '../types/control-points-state';
import { HorizonMode } from '../types/calibration-settings';

export default class ControlPointsPanel1VP extends ControlPointsPanelBase {
  render() {
    let state = this.props.controlPointsState1VP
    let params = this.props.calibrationResult.calibrationResult1VP.cameraParameters
    let vpPosition: Point2D | null = null
    if (params) {
      vpPosition = CoordinatesUtil.convert(
        params.vanishingPoint,
        ImageCoordinateFrame.ImagePlane,
        ImageCoordinateFrame.Absolute,
        this.props.width,
        this.props.height
      )
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
          enabled={true}
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
          color={"blue"}
          vanishingPointIndex={0}
          controlState={
            this.rel2AbsVanishingPointControlState(
              state.vanishingPoints[0]
            )
          }
          vanishingPointPosition={
            vpPosition
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
          pointPairDisabled={
            this.rel2AbsControlPointPairState(
              [
                { x: 0.2, y: 0.5 },
                { x: 0.8, y: 0.5 }
              ]
            )
          }
          enabled={this.props.calibrationSettings1VP.horizonMode == HorizonMode.Manual}
          dragCallback={(controlPointIndex: ControlPointPairIndex, position: Point2D) => {
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
}