import * as React from 'react'
import Vector3D from '../../solver/vector-3d'
import Point2D from '../../solver/point-2d'
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util'
import { Palette } from '../../style/palette'
import { Axis } from '../../types/calibration-settings'
import { GlobalSettings } from '../../types/global-settings'
import { SolverResult } from '../../solver/solver-result'
import MathUtil from '../../solver/math-util'

interface Overlay3DPanelProps {
  width: number
  height: number
  solverResult: SolverResult
  globalSettings: GlobalSettings
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

  private renderGridFloor(normalAxis: Axis | null) {
    if (!normalAxis) {
      return null
    }

    let cellCount = 10
    let cellSize = 0.15 * this.normalizationFactor
    let gridLines3D: [Vector3D, Vector3D][] = []
    let min = -0.5 * cellCount * cellSize
    let max = min + cellCount * cellSize

    function gridPoint(u: number, v: number): Vector3D {
      switch (normalAxis) {
        case Axis.NegativeX:
        case Axis.PositiveX:
          return new Vector3D(0, u, v)
        case Axis.NegativeY:
        case Axis.PositiveY:
          return new Vector3D(u, 0, v)
        case Axis.NegativeZ:
        case Axis.PositiveZ:
          return new Vector3D(u, v, 0)
      }
      throw new Error('Should not end up here')
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

    let gridLines2D: [Point2D, Point2D][] = []
    for (let gridLine3D of gridLines3D) {
      gridLines2D.push([
        this.project(gridLine3D[0]),
        this.project(gridLine3D[1])
      ])
    }

    return (
      <g stroke={Palette.lightGray} opacity={0.25}>
        {gridLines2D.map((endpoints: [Point2D, Point2D]) => {
          return <line x1={endpoints[0].x} y1={endpoints[0].y} x2={endpoints[1].x} y2={endpoints[1].y} />
        })}
      </g>
    )
  }

  private get normalizationFactor(): number {
    let cameraTransform = this.props.solverResult.cameraTransform
    let fov = this.props.solverResult.horizontalFieldOfView
    if (cameraTransform === null || fov === null) {
      return 0
    }
    let translation = new Vector3D(cameraTransform.matrix[0][3], cameraTransform.matrix[1][3], cameraTransform.matrix[2][3])
    let l = translation.length
    let s = Math.atan(0.5 * fov)
    return l * s
  }

  private renderAxes() {
    // Compute a scale factor so the axes have the same length
    // regardless of camera translation and field of view
    let axisLength = 0.3 * this.normalizationFactor

    return (
      <g>
        {this.renderAxis(Axis.PositiveX, axisLength, Palette.red)}
        {this.renderAxis(Axis.PositiveY, axisLength, Palette.green)}
        {this.renderAxis(Axis.PositiveZ, axisLength, Palette.blue)}
      </g>
    )
  }

  private renderAxis(axis: Axis, axisLength: number, color: string) {
    let arrowSize = 0.12 * axisLength
    let projectedOrigin = this.project(new Vector3D())
    let endpoint = new Vector3D()
    let axisNormal = new Vector3D()
    switch (axis) {
      case Axis.PositiveX:
        endpoint.x = axisLength
        axisNormal.y = 1
        break
      case Axis.PositiveY:
        endpoint.y = axisLength
        axisNormal.z = 1
        break
      case Axis.PositiveZ:
        endpoint.z = axisLength
        axisNormal.y = 1
        break
      default:
        // Negative axis. Shouldn't end up here
        return undefined
    }

    let axisDirection = endpoint.normalized()
    let arrowWidth = 0.7
    let arrowWedgeStart = this.project(
      new Vector3D(
        endpoint.x + arrowSize * (arrowWidth * axisNormal.x - axisDirection.x),
        endpoint.y + arrowSize * (arrowWidth * axisNormal.y - axisDirection.y),
        endpoint.z + arrowSize * (arrowWidth * axisNormal.z - axisDirection.z)
      )
    )
    let arrowWedgeEnd = this.project(
      new Vector3D(
        endpoint.x + arrowSize * (-arrowWidth * axisNormal.x - axisDirection.x),
        endpoint.y + arrowSize * (-arrowWidth * axisNormal.y - axisDirection.y),
        endpoint.z + arrowSize * (-arrowWidth * axisNormal.z - axisDirection.z)
      )
    )

    let projectedEndpoint = this.project(endpoint)
    return (
      <g>
        <line
          x1={projectedOrigin.x}
          y1={projectedOrigin.y}
          x2={projectedEndpoint.x}
          y2={projectedEndpoint.y}
          stroke={color}
        />
        <polyline
          points={'' + arrowWedgeStart.x + ', ' + arrowWedgeStart.y + ', ' + projectedEndpoint.x + ', ' + projectedEndpoint.y + ', ' + arrowWedgeEnd.x + ', ' + arrowWedgeEnd.y}
          stroke={color}
          fill='none'
        />
      </g>
    )
  }

  private project(point: Vector3D): Point2D {
    let cameraTransform = this.props.solverResult.cameraTransform
    let principalPoint = this.props.solverResult.principalPoint
    let horizontalFieldOfView = this.props.solverResult.horizontalFieldOfView
    if (cameraTransform === null || principalPoint === null || horizontalFieldOfView === null) {
      // TODO: return null instead?
      return { x: 0, y: 0 }
    }

    return CoordinatesUtil.convert(
      MathUtil.perspectiveProject(
        point,
        cameraTransform,
        principalPoint,
        horizontalFieldOfView
      ),
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height
    )
  }
}
