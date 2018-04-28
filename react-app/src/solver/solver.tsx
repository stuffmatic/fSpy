import { CalibrationSettings1VP, CalibrationSettings2VP } from "../types/calibration-settings";
import { ControlPointsState1VP, ControlPointsState2VP } from "../types/control-points-state";
import { ImageState } from "../types/image-state";
import { CalibrationResult1VP, CalibrationResult2VP } from "./calibration-result";

export default class Solver {

  static solve1VP(
    settings:CalibrationSettings1VP,
    controlPoints:ControlPointsState1VP,
    image:ImageState
  ):CalibrationResult1VP {

    let errors = this.validateImage(image)
    if (errors.length > 0) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    return {
      errors: ["1VP calibration has not been implemented " + Math.random()],
      warnings: [],
      cameraParameters: null
    }

  }

  static solve2VP(
    settings:CalibrationSettings2VP,
    controlPoints:ControlPointsState2VP,
    image:ImageState
  ):CalibrationResult2VP {
    let errors = this.validateImage(image)
    if (errors.length > 0) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    return {
      errors: ["2VP calibration has not been implemented " + Math.random()],
      warnings: [],
      cameraParameters: null
    }
  }

  private static validateImage(image:ImageState):string[] {
    let errors:string[] = []
    if (image.width == null || image.height == null) {
      errors.push("No image loaded")
    }
    return errors
  }

}