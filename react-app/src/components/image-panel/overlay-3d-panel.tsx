import * as React from 'react';
import Vector3D from '../../solver/vector-3d';
import Point2D from '../../solver/point-2d';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';
import { Palette } from '../../style/palette';
import { Axis } from '../../types/calibration-settings';
import { GlobalSettings } from '../../types/global-settings';
import { SolverResult } from '../../solver/solver-result';

interface Overlay3DPanelProps {
  width: number
  height: number
  solverResult:SolverResult
  globalSettings:GlobalSettings
}

export default class Overlay3DPanel extends React.PureComponent<Overlay3DPanelProps> {
  render() {
    return (
      <g>
        {this.renderGridFloor(this.props.globalSettings.gridFloorNormal)}
        {this.renderAxes()}
      </g>
    )
  }

  private renderGridFloor(normalAxis:Axis | null) {
    if (!normalAxis) {
      return null
    }

    let cellCount = 10
    let cellSize = 0.5
    let gridLines3D:[Vector3D, Vector3D][] = []
    let min = -0.5 * cellCount * cellSize
    let max = min + cellCount * cellSize

    function gridPoint(u:number, v:number):Vector3D {
      switch (normalAxis) {
        case Axis.NegativeX, Axis.PositiveX:
          return new Vector3D(0, u, v)
        case Axis.NegativeY, Axis.PositiveY:
          return new Vector3D(u, 0, v)
        case Axis.NegativeZ, Axis.PositiveZ:
          return new Vector3D(u, v, 0)
      }
      throw "Should not end up here"
    }

    for (let i = 0; i <= cellCount; i++) {
      let linePosition = min + i * cellSize
      gridLines3D.push(
        [
          gridPoint(min, linePosition),
          gridPoint(max, linePosition)
        ]
      ),
      gridLines3D.push(
        [
          gridPoint(linePosition, min),
          gridPoint(linePosition, max)
        ]
      )
    }

    let gridLines2D:[Point2D, Point2D][] = []
    for (let gridLine3D of gridLines3D) {
      gridLines2D.push([
        this.project(gridLine3D[0]),
        this.project(gridLine3D[1])
      ])
    }

    return (
      <g stroke={Palette.lightGray} opacity={0.25}>
        { gridLines2D.map((endpoints:[Point2D, Point2D]) => {
          return <line x1={endpoints[0].x} y1={endpoints[0].y} x2={endpoints[1].x} y2={endpoints[1].y} />
        })}
      </g>
    )
  }


  private renderAxes() {
    let axisLength = 1
    let axisEndpoints = [
      new Vector3D(axisLength, 0, 0),
      new Vector3D(0, axisLength, 0),
      new Vector3D(0, 0, axisLength)
    ]
    let projectedAxisEndpoints = axisEndpoints.map((vector:Vector3D) => this.project(vector))
    let origin = new Vector3D()
    let projectedOrigin = this.project(origin)

    //TODO: DRY
    return (
      <g>
        <line
          x1={projectedOrigin.x}
          y1={projectedOrigin.y}
          x2={projectedAxisEndpoints[0].x}
          y2={projectedAxisEndpoints[0].y}
          stroke={Palette.red}
        />
        <line
          x1={projectedOrigin.x}
          y1={projectedOrigin.y}
          x2={projectedAxisEndpoints[1].x}
          y2={projectedAxisEndpoints[1].y}
          stroke={Palette.green}
        />
        <line
          x1={projectedOrigin.x}
          y1={projectedOrigin.y}
          x2={projectedAxisEndpoints[2].x}
          y2={projectedAxisEndpoints[2].y}
          stroke={Palette.blue}
        />
      </g>
    )
  }

  private project(point:Vector3D):Point2D {
    if (!this.props.solverResult.principalPoint) {
      return {x: 0, y: 0}
    }

    let projected = point
    if (this.props.solverResult.cameraTransform) {
      this.props.solverResult.cameraTransform.transformVector(projected)
    }

    let fov = this.props.solverResult.horizontalFieldOfView!
    let s = 1 / Math.tan(0.5 * fov)
    projected.x = s * projected.x / (-projected.z) + this.props.solverResult.principalPoint.x
    projected.y = s * projected.y / (-projected.z) + this.props.solverResult.principalPoint.y

    return CoordinatesUtil.convert(
      point,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height,
    )
  }
}