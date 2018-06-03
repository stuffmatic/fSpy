import { SolverResult } from '../solver/solver-result'

export const defaultSolverResult: SolverResult = {
  errors: [],
  warnings: [],
  principalPoint: null,
  vanishingPoints: null,
  cameraTransform: null,
  horizontalFieldOfView: null,
  verticalFieldOfView: null,
  relativeFocalLength: null,
  vanishingPointAxes: null
}
