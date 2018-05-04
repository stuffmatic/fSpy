import * as React from 'react';
import { ControlPointsContainerDimensionProps, ControlPointsContainerCallbacks, ControlPointsContainerProps } from '../../containers/control-points-container';
import { VanishingPointControlState, ControlPointPairState, ControlPointPairIndex } from '../../types/control-points-state';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';
import Point2D from '../../solver/point-2d';
import { CalibrationMode } from '../../types/global-settings';
import PrincipalPointControl from './principal-point-control'
import OriginControl from './origin-control'

type ControlPointsPanelProps = ControlPointsContainerDimensionProps & ControlPointsContainerCallbacks & ControlPointsContainerProps

export default class ControlPointsPanelBase extends React.PureComponent<ControlPointsPanelProps> {

  protected renderPrincipalPointControl(position: Point2D, isEnabled: boolean) {
    return (
      <PrincipalPointControl
          position={
            CoordinatesUtil.convert(
              isEnabled ? position : {x: 0.5, y: 0.5 },
              ImageCoordinateFrame.Relative,
              ImageCoordinateFrame.Absolute,
              this.props.width,
              this.props.height
            )
          }
          enabled={isEnabled}
          dragCallback={(position: Point2D) => {
            this.invokeControlPointDragCallback(
              position,
              this.props.onPrincipalPointDrag
            )
          }}
      />
    )
  }

  protected renderOriginControl(position:Point2D) {
    return (
      <OriginControl
          position={
            CoordinatesUtil.convert(
              position,
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
    )
  }

  protected rel2AbsVanishingPointControlState(state: VanishingPointControlState): VanishingPointControlState {
    return {
      vanishingLines: [
        this.rel2AbsControlPointPairState(state.vanishingLines[0]),
        this.rel2AbsControlPointPairState(state.vanishingLines[1])
      ]
    }
  }

  protected rel2AbsControlPointPairState(rel: ControlPointPairState): ControlPointPairState {
    return [
      CoordinatesUtil.convert(
        rel[0],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.Absolute,
        this.props.width,
        this.props.height
      ),
      CoordinatesUtil.convert(
        rel[1],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.Absolute,
        this.props.width,
        this.props.height
      )
    ]
  }

  protected invokeControlPointDragCallback(
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }

  protected invokeEndpointDragCallback(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode, controlPointIndex: ControlPointPairIndex, position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      controlPointIndex,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }

  protected invokeVanishingLineEndpointDragCallback(
    vanishingPointIndex: number,
    vanishingLineIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D,
    callback: (calibrationMode: CalibrationMode,
      vanishingPointIndex: number,
      vanishingLineIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D) => void
  ) {
    callback(
      this.props.globalSettings.calibrationMode,
      vanishingPointIndex,
      vanishingLineIndex,
      controlPointIndex,
      CoordinatesUtil.convert(
        position,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        this.props.width,
        this.props.height
      )
    )
  }
}