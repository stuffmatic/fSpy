import Transform from './transform'
import Point2D from './point-2d'
import { Axis } from '../types/calibration-settings'

export interface CameraParameters {
  principalPoint: Point2D
  cameraTransform: Transform
  horizontalFieldOfView: number
  verticalFieldOfView: number
  vanishingPoints: [Point2D, Point2D, Point2D]
  vanishingPointAxes: [Axis, Axis, Axis]
  relativeFocalLength: number,
  imageWidth: number,
  imageHeight: number
}

export interface SolverResult {
  errors: string[]
  warnings: string[]
  cameraParameters: CameraParameters | null
}
