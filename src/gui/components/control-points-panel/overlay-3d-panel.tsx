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
import Vector3D from '../../solver/vector-3d'
import Point2D from '../../solver/point-2d'
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util'
import { Palette } from '../../style/palette'
import { Axis } from '../../types/calibration-settings'
import { GlobalSettings, Overlay3DGuide } from '../../types/global-settings'
import { CameraParameters } from '../../solver/solver-result'
import MathUtil from '../../solver/math-util'
import { Group, Line } from 'react-konva'
import AABB from '../../solver/aabb'
import AABBOps from '../../solver/aabb-ops'
import { Point } from 'electron'
import { axisGlyph } from './glyph-paths'

interface GridLineProps {
  points: Point2D[]
  isClosed?: boolean
}

function GridPolyline(props: GridLineProps) {
  let coords: number[] = []
  for (let point of props.points) {
    coords.push(point.x)
    coords.push(point.y)
  }

  return (
    <Line
      closed={props.isClosed}
      points={coords}
      stroke={Palette.lightGray}
      strokeWidth={0.7}
      opacity={0.5}
    />
  )
}

interface Overlay3DPanelProps {
  width: number
  height: number
  imageAABB: AABB
  cameraParameters: CameraParameters
  globalSettings: GlobalSettings,
  referenceDistanceAxis: Axis | null
}

export default class Overlay3DPanel extends React.PureComponent<Overlay3DPanelProps> {
  render() {
    return (
      <Group>
        {this.render3DGuide(this.props.globalSettings.overlay3DGuide)}
        {this.renderAxes()}
      </Group>
    )
  }

  private render3DGuide(overlay3DGuide: Overlay3DGuide) {
    switch (overlay3DGuide) {
      case Overlay3DGuide.Box:
        return this.renderBox()
      case Overlay3DGuide.XYGridFloor:
        return this.renderGridFloor(Axis.PositiveZ)
      case Overlay3DGuide.YZGridFloor:
        return this.renderGridFloor(Axis.PositiveX)
      case Overlay3DGuide.ZXGridFloor:
        return this.renderGridFloor(Axis.PositiveY)
    }

    return null
  }

  private renderBox() {
    let size = 0.3 * this.normalizationFactor

    let zMinFace: Vector3D[] = [
      new Vector3D(-1, -1, -1),
      new Vector3D(1, -1, -1),
      new Vector3D(1, 1, -1),
      new Vector3D(-1, 1, -1)
    ]

    let zMaxFace: Vector3D[] = [
      new Vector3D(-1, -1, 1),
      new Vector3D(1, -1, 1),
      new Vector3D(1, 1, 1),
      new Vector3D(-1, 1, 1)
    ]

    let edges: Vector3D[][] = [
      [new Vector3D(-1, -1, -1), new Vector3D(-1, -1, 1)],
      [new Vector3D(1, -1, -1), new Vector3D(1, -1, 1)],
      [new Vector3D(1, 1, -1), new Vector3D(1, 1, 1)],
      [new Vector3D(-1, 1, -1), new Vector3D(-1, 1, 1)]
    ]

    let projectedFaces: Point[][] = []
    for (let face of [zMinFace, zMaxFace]) {
      let projected = face.map((vector: Vector3D) => this.project(vector.multipliedByScalar(size)))
      projectedFaces.push(projected)
    }

    let projectedEdges: Point2D[][] = []
    for (let edge of edges) {
      projectedEdges.push(
        edge.map((vector: Vector3D) => this.project(vector.multipliedByScalar(size)))
      )
    }

    return (
      <Group>
        <GridPolyline points={projectedFaces[0]} isClosed={true} />
        <GridPolyline points={projectedFaces[1]} isClosed={true} />
        <GridPolyline points={projectedEdges[0]} />
        <GridPolyline points={projectedEdges[1]} />
        <GridPolyline points={projectedEdges[2]} />
        <GridPolyline points={projectedEdges[3]} />
      </Group>
    )
  }

  private renderGridFloor(normalAxis: Axis) {
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
      <Group>
        {gridLines2D.map((endpoints: [Point2D, Point2D], index: number) => {
          return (<GridPolyline
            key={index}
            points={endpoints}
          />)
        })}
      </Group>
    )
  }

  private get normalizationFactor(): number {
    const viewTransform = this.props.cameraParameters.viewTransform
    let fov = this.props.cameraParameters.horizontalFieldOfView
    let translation = new Vector3D(viewTransform.matrix[0][3], viewTransform.matrix[1][3], viewTransform.matrix[2][3])
    let l = translation.length
    let s = Math.atan(0.5 * fov)
    return l * s
  }

  private renderAxes() {
    // Compute a scale factor so the axes have the same length
    // regardless of camera translation and field of view
    let axisLength = 0.3 * this.normalizationFactor

    return (
      <Group>
        {this.renderAxis(
          Axis.PositiveX,
          axisLength,
          Palette.red,
          this.props.referenceDistanceAxis == Axis.PositiveX || this.props.referenceDistanceAxis == Axis.NegativeX
        )}
        {this.renderAxis(
          Axis.PositiveY,
          axisLength,
          Palette.green,
          this.props.referenceDistanceAxis == Axis.PositiveY || this.props.referenceDistanceAxis == Axis.NegativeY
        )}
        {this.renderAxis(
          Axis.PositiveZ,
          axisLength,
          Palette.blue,
          this.props.referenceDistanceAxis == Axis.PositiveZ || this.props.referenceDistanceAxis == Axis.NegativeZ
        )}
      </Group>
    )
  }

  private renderAxis(axis: Axis, axisLength: number, color: string, arrowAndLabelOnly: boolean) {
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
    let labelPosition = this.project(endpoint.multipliedByScalar(1.1))
    return (
      <Group>
        {arrowAndLabelOnly ? null : (<Line
          strokeWidth={1}
          points={[projectedOrigin.x, projectedOrigin.y, projectedEndpoint.x, projectedEndpoint.y]}
          stroke={color}
        />)}
        <Line
          strokeWidth={1}
          points={[arrowWedgeStart.x, arrowWedgeStart.y, projectedEndpoint.x, projectedEndpoint.y, arrowWedgeEnd.x, arrowWedgeEnd.y]}
          stroke={color}
        />
        {axisGlyph(axis, labelPosition, 8)}
      </Group>
    )
  }

  private project(point: Vector3D): Point2D {
    let viewTransform = this.props.cameraParameters.viewTransform
    let principalPoint = this.props.cameraParameters.principalPoint
    let imageWidth = AABBOps.width(this.props.imageAABB)
    let imageHeight = AABBOps.height(this.props.imageAABB)
    let horizontalFieldOfView = this.props.cameraParameters.horizontalFieldOfView

    let relativePosition = CoordinatesUtil.convert(
      MathUtil.perspectiveProject(
        point,
        viewTransform,
        principalPoint,
        horizontalFieldOfView
      ),
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      imageWidth,
      imageHeight
    )

    return {
      x: this.props.imageAABB.xMin + relativePosition.x * AABBOps.width(this.props.imageAABB),
      y: this.props.imageAABB.yMin + relativePosition.y * AABBOps.height(this.props.imageAABB)
    }
  }
}
