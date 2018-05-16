import Transform from "./transform";
import Point2D from "./point-2d";
import { Axis } from "../types/calibration-settings";

export interface SolverResult {
  errors:string[]
  warnings:string[]

  principalPoint:Point2D | null
  cameraTransform:Transform | null
  horizontalFieldOfView:number | null

  vanishingPoints:[Point2D, Point2D, Point2D] | null
  vanishingPointAxes:[Axis, Axis, Axis] | null
  verticalFieldOfView:number | null
  relativeFocalLength:number | null
}