import { CalibrationSettings1VP, CalibrationSettings2VP } from "../types/calibration-settings";
import { ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState } from "../types/control-points-state";
import { ImageState } from "../types/image-state";
import { CalibrationResult1VP, CalibrationResult2VP } from "./calibration-result";
import MathUtil from "./math-util";
import Point2D from "./point-2d";
import Transform from "./transform";


export default class Solver {

  static solve1VP(
    settings: CalibrationSettings1VP,
    controlPoints: ControlPointsState1VP,
    image: ImageState
  ): CalibrationResult1VP {

    let errors = this.validateImage(image)
    if (errors.length > 0) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    let vanishingPoints = this.computeVanishingPoints(
      controlPoints.vanishingPoints,
      errors
    )

    if (!vanishingPoints) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    return {
      errors: ["1VP calibration has not been implemented " + Math.random()],
      warnings: [],
      cameraParameters: {
        cameraTransform: new Transform(),
        vanishingPoint: vanishingPoints[0]
      }
    }

  }

  static solve2VP(
    settings: CalibrationSettings2VP,
    controlPoints: ControlPointsState2VP,
    image: ImageState
  ): CalibrationResult2VP {
    let errors = this.validateImage(image)
    if (errors.length > 0) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    let vanishingPoints = this.computeVanishingPoints(
      controlPoints.vanishingPoints,
      errors
    )

    if (!vanishingPoints) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }


    return {
      errors: ["2VP calibration has not been implemented " + Math.random()],
      warnings: [],
      cameraParameters: {
        cameraTransform: new Transform(),
        vanishingPoints: vanishingPoints as [Point2D, Point2D] | [Point2D, Point2D, Point2D],
        relativeFocalLength: 0,
        computedPrincipalPoint: null
      }
    }
  }

  private static validateImage(image: ImageState): string[] {
    let errors: string[] = []
    if (image.width == null || image.height == null) {
      errors.push("No image loaded")
    }
    return errors
  }

  private static computeVanishingPoints(controlPointStates:VanishingPointControlState[], errors:string[]):Point2D[] | null {
    let result:Point2D[] = []
    for (let i = 0; i < controlPointStates.length; i++) {
      let vanishingPoint = MathUtil.lineIntersection(
        controlPointStates[i].vanishingLines[0],
        controlPointStates[i].vanishingLines[1]
      )
      if (vanishingPoint) {
        result.push(vanishingPoint)
      }
      else {
        errors.push("Failed to compute vanishing point " + (i + 1))
      }
    }

    return errors.length == 0 ? result : null
  }

}