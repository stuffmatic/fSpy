import Transform from "./transform";
import Point2D from "./point-2d";

export interface SolverResult {
  errors:string[]
  warnings:string[]

  principalPoint:Point2D | null
  vanishingPoints:[Point2D, Point2D, Point2D] | null
  cameraTransform:Transform | null
  horizontalFieldOfView:number | null
  verticalFieldOfView:number | null
  relativeFocalLength:number | null
}