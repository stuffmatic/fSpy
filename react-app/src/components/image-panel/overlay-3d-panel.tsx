import * as React from 'react';
import Vector3D from '../../solver/vector-3d';
import Point2D from '../../solver/point-2d';
import CoordinatesUtil, { ImageCoordinateFrame } from '../../solver/coordinates-util';
import Transform from '../../solver/transform';
import { Palette } from '../../style/palette';

interface Overlay3DPanelProps {
  width: number
  height: number
  cameraTransform:Transform | null
  horizontalFieldOfView:number | null
}

export default class Overlay3DPanel extends React.PureComponent<Overlay3DPanelProps> {
  render() {
    return (
      <g>
        {this.renderGridFloor()}
        {this.renderAxes()}
      </g>
    )
  }

  private renderGridFloor() {
    return null
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
    if (this.props.cameraTransform) {
      this.props.cameraTransform.transformVector(point)
    }

    return CoordinatesUtil.convert(
      point,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Absolute,
      this.props.width,
      this.props.height,
    )
  }
}