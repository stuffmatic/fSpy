import CalibrationResult from "../types/calibration-result";

export const defaultCalibrationResult: CalibrationResult = {
  calibrationResult1VP: {
    errors: [],
    warnings: [],
    cameraParameters: {
      cameraTransform: null,
      horizontalFieldOfView: null,
      verticalFieldOfView: null,
      relativeFocalLength: null,
      vanishingPoint: null,
      principalPoint: {x: 0, y: 0}
    }
  },
  calibrationResult2VP: {
    errors: [],
    warnings: [],
    cameraParameters: {
      cameraTransform: null,
      horizontalFieldOfView: null,
      verticalFieldOfView: null,
      relativeFocalLength: null,
      vanishingPoints: null,
      principalPoint: {x: 0, y: 0}
    }
  }
}
