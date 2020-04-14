/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from 'react'
import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointPairIndex, ControlPointsStateBase } from '../types/control-points-state'
import { connect } from 'react-redux'
import { GlobalSettings } from '../types/global-settings'
import ControlPointsPanel from '../components/control-points-panel/control-points-panel'
import Point2D from '../solver/point-2d'
import { AppAction, setPrincipalPoint, setOrigin, setReferenceDistanceAnchor, adjustHorizon, adjustReferenceDistanceHandle, adjustFirstVanishingPoint, adjustSecondVanishingPoint, adjustThirdVanishingPoint } from '../actions'
import { CalibrationSettingsBase, CalibrationSettings1VP, CalibrationSettings2VP } from '../types/calibration-settings'
import { SolverResult } from '../solver/solver-result'
import { Dispatch } from 'redux'

export interface ControlPointsContainerCallbacks {
  onPrincipalPointDrag(position: Point2D): void
  onOriginDrag(position: Point2D): void
  onReferenceDistanceHandleDrag(handleIndex: number, position: number): void
  onReferenceDistanceAnchorDrag(position: Point2D): void
  onFirstVanishingPointControlPointDrag(
    lineSegmentIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
  onSecondVanishingPointControlPointDrag(
    lineSegmentIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
  onThirdVanishingPointControlPointDrag(
    lineSegmentIndex: number,
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
  onHorizonDrag(
    controlPointIndex: ControlPointPairIndex,
    position: Point2D
  ): void
}

interface ControlPointsContainerProps {
  imageState: ImageState
  globalSettings: GlobalSettings

  calibrationSettingsBase: CalibrationSettingsBase
  calibrationSettings1VP: CalibrationSettings1VP
  calibrationSettings2VP: CalibrationSettings2VP

  controlPointsStateBase: ControlPointsStateBase
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP
  solverResult: SolverResult
  applyImagePadding: boolean
}

class ControlPointsContainer extends React.Component<ControlPointsContainerProps & ControlPointsContainerCallbacks> {
  render() {
    return (
      <ControlPointsPanel
        imageState={this.props.imageState}
        callbacks={this.props} // callbacks is a subset of props
        globalSettings={this.props.globalSettings}
        calibrationSettingsBase={this.props.calibrationSettingsBase}
        calbrationSettings1VP={this.props.calibrationSettings1VP}
        calbrationSettings2VP={this.props.calibrationSettings2VP}
        controlPointsStateBase={this.props.controlPointsStateBase}
        controlPointsState1VP={this.props.controlPointsState1VP}
        controlPointsState2VP={this.props.controlPointsState2VP}
        solverResult={this.props.solverResult}
        applyImagePadding={this.props.applyImagePadding}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    imageState: state.image,
    globalSettings: state.globalSettings,
    calibrationSettingsBase: state.calibrationSettingsBase,
    calibrationSettings1VP: state.calibrationSettings1VP,
    calibrationSettings2VP: state.calibrationSettings2VP,
    controlPointsStateBase: state.controlPointsStateBase,
    controlPointsState1VP: state.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsState2VP,
    solverResult: state.solverResult,
    applyImagePadding: state.uiState.sidePanelsAreVisible
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (position: Point2D) => {
      dispatch(setPrincipalPoint(position))
    },
    onOriginDrag: (position: Point2D) => {
      dispatch(setOrigin(position))
    },
    onReferenceDistanceHandleDrag: (handleIndex: number, position: number) => {
      dispatch(adjustReferenceDistanceHandle(handleIndex, position))
    },
    onReferenceDistanceAnchorDrag: (position: Point2D) => {
      dispatch(setReferenceDistanceAnchor(
        position
      ))
    },
    onFirstVanishingPointControlPointDrag: (
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(
        adjustFirstVanishingPoint(lineSegmentIndex, controlPointIndex, position)
      )
    },
    onSecondVanishingPointControlPointDrag: (
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(
        adjustSecondVanishingPoint(lineSegmentIndex, controlPointIndex, position)
      )
    },
    onThirdVanishingPointControlPointDrag: (
      lineSegmentIndex: number,
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(
        adjustThirdVanishingPoint(lineSegmentIndex, controlPointIndex, position)
      )
    },
    onHorizonDrag: (
      controlPointIndex: ControlPointPairIndex,
      position: Point2D
    ) => {
      dispatch(adjustHorizon(controlPointIndex, position))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer)
