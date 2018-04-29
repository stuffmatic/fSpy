import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode2VP } from "../types/calibration-settings";
import { ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState } from "../types/control-points-state";
import { ImageState } from "../types/image-state";
import { CalibrationResult1VP, CalibrationResult2VP } from "./calibration-result";
import MathUtil from "./math-util";
import Point2D from "./point-2d";
import Transform from "./transform";

/*
The solver handles estimation of focal length and camera orientation
from input line segments. All sections numbers, equations numbers etc
refer to "Using Vanishing Points for Camera Calibration and Coarse 3D Reconstruction
from a Single Image" by E. Guillou, D. Meneveaux, E. Maisel, K. Bouatouch.
(http://www.irisa.fr/prive/kadi/Reconstruction/paper.ps.gz).
*/

class SolverBase {
  protected static validateImage(image: ImageState): string[] {
    let errors: string[] = []
    if (image.width == null || image.height == null) {
      errors.push("No image loaded")
    }
    return errors
  }

  protected static computeVanishingPoints(image: ImageState, controlPointStates: VanishingPointControlState[], errors: string[]): Point2D[] | null {
    let result: Point2D[] = []
    for (let i = 0; i < controlPointStates.length; i++) {
      let vanishingPoint = MathUtil.lineIntersection(
        controlPointStates[i].vanishingLines[0],
        controlPointStates[i].vanishingLines[1]
      )
      if (vanishingPoint) {
        result.push(MathUtil.relativeToImagePlaneCoords(vanishingPoint, image.width!, image.height!) )
      }
      else {
        errors.push("Failed to compute vanishing point")
      }
    }

    return errors.length == 0 ? result : null
  }
}

export default class Solver extends SolverBase {

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
      image,
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

    //Compute the two vanishing points specified using control points
    let vanishingPoints = this.computeVanishingPoints(
      image,
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

    //Get the principal point
    let principalPoint: Point2D = { x: 0, y: 0 }
    let computedPrincipalPoint:Point2D | null = null
    switch (settings.principalPointMode) {
      case PrincipalPointMode2VP.Manual:
        principalPoint = MathUtil.relativeToImagePlaneCoords(controlPoints.principalPoint, image.width!, image.height!)
        break
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        let result = this.computeVanishingPoints(image, [controlPoints.vanishingPoints[2]], errors)
        if (result) {
          let thirdVanishingPoint = result[0]
          principalPoint = MathUtil.triangleOrthoCenter(
            vanishingPoints[0], vanishingPoints[1], thirdVanishingPoint
          )
          computedPrincipalPoint = principalPoint
        }
        break
    }

    if (errors.length > 0) {
      return {
        errors: errors,
        warnings: [],
        cameraParameters: null
      }
    }

    let fRelative = this.computeFocalLength(
      vanishingPoints[0], vanishingPoints[1], principalPoint
    )! //TODO: check for null

    let cameraTransform = this.computeCameraRotationMatrix(
      vanishingPoints[0], vanishingPoints[1], fRelative, principalPoint
    )


    return {
      errors: ["2VP calibration has not been implemented " + Math.random()],
      warnings: [],
      cameraParameters: {
        cameraTransform: cameraTransform,
        vanishingPoints: vanishingPoints as [Point2D, Point2D] |  [Point2D, Point2D, Point2D],
        relativeFocalLength: fRelative,
        computedPrincipalPoint: computedPrincipalPoint
      }
    }
  }

  /**
   * Computes the focal length based on two vanishing points and a center of projection.
   * See 3.2 "Determining the focal length from a single image"
   * @param Fu the first vanishing point in normalized image coordinates.
   * @param Fv the second vanishing point in normalized image coordinates.
   * @param P the center of projection in normalized image coordinates.
   * @returns The relative focal length.
   */
  static computeFocalLength(Fu: Point2D, Fv: Point2D, P: Point2D): number |  null {
    //compute Puv, the orthogonal projection of P onto FuFv
    let dirFuFv = MathUtil.normalized(MathUtil.difference(Fu, Fv)) //  normalize([x - y for x, y in zip(Fu, Fv)])
    let FvP = MathUtil.difference(P, Fv) //FvP = [x - y for x, y in zip(P, Fv)]
    let proj = MathUtil.dot(dirFuFv, FvP)
    let Puv = { // [proj * x + y for x, y in zip(dirFuFv, Fv)]
      x: proj * dirFuFv.x + Fv.x,
      y: proj * dirFuFv.y + Fv.y
    }

    let PPuv = MathUtil.distance({ x: 0, y: 0 }, MathUtil.difference(P, Puv)) // length([x - y for x, y in zip(P, Puv)])

    let FvPuv = MathUtil.distance({ x: 0, y: 0 }, MathUtil.difference(Fv, Puv)) //length([x - y for x, y in zip(Fv, Puv)])
    let FuPuv = MathUtil.distance({ x: 0, y: 0 }, MathUtil.difference(Fu, Puv)) //length([x - y for x, y in zip(Fu, Puv)])
    //let FuFv = MathUtil.distance({ x: 0, y: 0 }, MathUtil.difference(Fu, Fv))//length([x - y for x, y in zip(Fu, Fv)])
    //print("FuFv", FuFv, "FvPuv + FuPuv", FvPuv + FuPuv)

    let fSq = FvPuv * FuPuv - PPuv * PPuv
    //print("FuPuv", FuPuv, "FvPuv", FvPuv, "PPuv", PPuv, "OPuv", FvPuv * FuPuv)
    //print("fSq = ", fSq, " = ", FvPuv * FuPuv, " - ", PPuv * PPuv)
    if (fSq <= 0)  {
      return null
    }

    return Math.sqrt(fSq)
    //print("dot 1:", dot(normalize(Fu + [f]), normalize(Fv + [f])))
  }
  /**
   * Computes the camera rotation matrix based on two vanishing points
   * and a focal length as in section 3.3 "Computing the rotation matrix".
   * @param Fu the first vanishing point in normalized image coordinates.
   * @param Fv the second vanishing point in normalized image coordinates.
   * @param f the relative focal length.
   * @param P the principal point
   * @returns The matrix Moc
   */
  static computeCameraRotationMatrix(Fu: Point2D, Fv: Point2D, f: number, P: Point2D): Transform  {
    /*Fu[0] -= P[0]
    Fu[1] -= P[1]

    Fv[0] -= P[0]
    Fv[1] -= P[1]

    let OFu = [Fu.x - P.x, Fu.y, f]
    let OFv = [Fv[0], Fv[1], f]

    #print("matrix dot", dot(OFu, OFv))

    s1 = length(OFu)
    upRc = normalize(OFu)

    s2 = length(OFv)
    vpRc = normalize(OFv)

    wpRc = [upRc[1] * vpRc[2] - upRc[2] * vpRc[1], upRc[2] * vpRc[0] - upRc[0] * vpRc[2], upRc[0] * vpRc[1] - upRc[1] * vpRc[0]]

    M = mathutils.Matrix()
    M[0][0] = Fu[0] / s1
    M[0][1] = Fv[0] / s2
    M[0][2] = wpRc[0]

    M[1][0] = Fu[1] / s1
    M[1][1] = Fv[1] / s2
    M[1][2] = wpRc[1]

    M[2][0] = f / s1
    M[2][1] = f / s2
    M[2][2] = wpRc[2]

    */

    return new Transform()
  }



}