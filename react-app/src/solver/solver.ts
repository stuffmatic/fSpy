import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode2VP, Axis } from "../types/calibration-settings";
import { ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState } from "../types/control-points-state";
import { ImageState } from "../types/image-state";
import { CalibrationResult1VP, CalibrationResult2VP } from "./calibration-result";
import MathUtil from "./math-util";
import Point2D from "./point-2d";
import Transform from "./transform";
import Vector3D from "./vector-3d";
import CoordinatesUtil, { ImageCoordinateFrame } from "./coordinates-util";


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
        result.push(
          CoordinatesUtil.convert(
            vanishingPoint,
            ImageCoordinateFrame.Relative,
            ImageCoordinateFrame.ImagePlane,
            image.width!,
            image.height!
          )
        )
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

    //TODO: use default instead of creating empty object again here?
    let result:CalibrationResult1VP = {
      errors: [],
      warnings: [],
      cameraParameters: {
        cameraTransform: null,
        horizontalFieldOfView: null,
        verticalFieldOfView: null,
        relativeFocalLength: null,
        vanishingPoint: null
      }
    }

    let errors = this.validateImage(image)
    if (errors.length > 0) {
      result.errors = errors
      return result
    }

    let vanishingPoints = this.computeVanishingPoints(
      image,
      controlPoints.vanishingPoints,
      errors
    )

    if (!vanishingPoints) {
      result.errors = errors
      return result
    }

    result.cameraParameters.cameraTransform = new Transform()
    result.cameraParameters.vanishingPoint = vanishingPoints[0]
    result.cameraParameters.horizontalFieldOfView = 0
    result.cameraParameters.verticalFieldOfView = 0
    result.cameraParameters.relativeFocalLength = 0

    return result
  }

  static solve2VP(
    settings: CalibrationSettings2VP,
    controlPoints: ControlPointsState2VP,
    image: ImageState
  ): CalibrationResult2VP {
    //TODO: use default instead of creating empty object again here?
    let result:CalibrationResult2VP = {
      errors: [],
      warnings: [],
      cameraParameters: {
        cameraTransform: null,
        horizontalFieldOfView: null,
        verticalFieldOfView: null,
        relativeFocalLength: null,
        vanishingPoints: null,
        computedPrincipalPoint: null
      }
    }


    let errors = this.validateImage(image)
    if (errors.length > 0) {
      result.errors = errors
      return result
    }

    //Compute the two vanishing points specified using control points
    let vanishingPoints = this.computeVanishingPoints(
      image,
      controlPoints.vanishingPoints,
      errors
    )

    if (!vanishingPoints) {
      result.errors = errors
      return result
    }

    //Get the principal point
    let principalPoint: Point2D = { x: 0, y: 0 }
    let computedPrincipalPoint: Point2D | null = null
    switch (settings.principalPointMode) {
      case PrincipalPointMode2VP.Manual:
        principalPoint = CoordinatesUtil.convert(
          controlPoints.principalPoint,
          ImageCoordinateFrame.Relative,
          ImageCoordinateFrame.ImagePlane,
          image.width!,
          image.height!
        )
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
      result.errors = errors
      return result
    }

    result.cameraParameters.computedPrincipalPoint = computedPrincipalPoint

    let fRelative = this.computeFocalLength(
      vanishingPoints[0], vanishingPoints[1], principalPoint
    )! //TODO: check for null
    result.cameraParameters.relativeFocalLength = fRelative

    let cameraTransform = this.computeCameraRotationMatrix(
      vanishingPoints[0], vanishingPoints[1], fRelative, principalPoint
    )



    //Assign axes to vanishing point
    let basisChangeTransform = new Transform()
    let row1 = this.axisVector(settings.vanishingPointAxes[0])
    let row2 = this.axisVector(settings.vanishingPointAxes[1])
    let row3 = row1.cross(row2)
    basisChangeTransform.matrix[0][0] = row1.x
    basisChangeTransform.matrix[0][1] = row1.y
    basisChangeTransform.matrix[0][2] = row1.z
    basisChangeTransform.matrix[1][0] = row2.x
    basisChangeTransform.matrix[1][1] = row2.y
    basisChangeTransform.matrix[1][2] = row2.z
    basisChangeTransform.matrix[2][0] = row3.x
    basisChangeTransform.matrix[2][1] = row3.y
    basisChangeTransform.matrix[2][2] = row3.z

    result.cameraParameters.cameraTransform = basisChangeTransform.leftMultiplied(cameraTransform)


    result.cameraParameters.horizontalFieldOfView = this.computeFieldOfView(
      image.width!,
      image.height!,
      fRelative,
      false
    )
    result.cameraParameters.verticalFieldOfView = this.computeFieldOfView(
      image.width!,
      image.height!,
      fRelative,
      true
    )


    //TODO: REMOVE THIS
    let lol = CoordinatesUtil.convert(
      controlPoints.origin,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      image.width!,
      image.height!
    )

    let k = Math.tan(0.5 * result.cameraParameters.horizontalFieldOfView)
    let lolz = new Vector3D(k * lol.x, k * lol.y, -1)


    //result.cameraParameters.cameraTransform.transposed().transformVector(lolz)
    result.cameraParameters.cameraTransform.matrix[0][3] = 10 * lolz.x
    result.cameraParameters.cameraTransform.matrix[1][3] = 10 * lolz.y
    result.cameraParameters.cameraTransform.matrix[2][3] = 10 * lolz.z


    if (Math.abs(cameraTransform.determinant - 1) > 1e-5) {
      result.warnings.push("Unreliable camera transform, determinant " + cameraTransform.determinant.toFixed(5))
    }

    return result
  }

  static computeFieldOfView(
    imageWidth: number,
    imageHeight: number,
    fRelative: number,
    vertical: boolean
  ): number {
    let aspectRatio = imageWidth / imageHeight
    let d = 2
    if (aspectRatio < 1) {
      //tall image
      if (!vertical) {
        d = 2 * aspectRatio
      }
    }
    else {
      //wide image
      if (vertical) {
        d = 2 / aspectRatio
      }
    }

    return 2 * Math.atan(d / (2 * fRelative))

  }

  /**
   * Computes the focal length based on two vanishing points and a center of projection.
   * See 3.2 "Determining the focal length from a single image"
   * @param Fu the first vanishing point in normalized image coordinates.
   * @param Fv the second vanishing point in normalized image coordinates.
   * @param P the center of projection in normalized image coordinates.
   * @returns The relative focal length.
   */
  static computeFocalLength(Fu: Point2D, Fv: Point2D, P: Point2D): number | null {
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
    if (fSq <= 0) {
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
  static computeCameraRotationMatrix(Fu: Point2D, Fv: Point2D, f: number, P: Point2D): Transform {
    /*Fu[0] -= P[0]
    Fu[1] -= P[1]

    Fv[0] -= P[0]
    Fv[1] -= P[1]
    */

    let OFu = new Vector3D(Fu.x - P.x, Fu.y - P.y, -f)
    let OFv = new Vector3D(Fv.x - P.x, Fv.y - P.y, -f)

    //print("matrix dot", dot(OFu, OFv))

    let s1 = OFu.length
    let upRc = OFu.normalized()

    let s2 = OFv.length
    let vpRc = OFv.normalized()

    let wpRc =  upRc.cross(vpRc)

    let M = new Transform()
    M.matrix[0][0] = OFu.x / s1
    M.matrix[0][1] = OFv.x / s2
    M.matrix[0][2] = wpRc.x

    M.matrix[1][0] = OFu.y / s1
    M.matrix[1][1] = OFv.y / s2
    M.matrix[1][2] = wpRc.y

    M.matrix[2][0] = -f / s1
    M.matrix[2][1] = -f / s2
    M.matrix[2][2] = wpRc.z

    return M
  }

  private static axisVector(axis:Axis):Vector3D {
    switch (axis) {
      case Axis.NegativeX:
        return new Vector3D(-1, 0, 0)
      case Axis.PositiveX:
        return new Vector3D(1, 0, 0)
      case Axis.NegativeY:
        return new Vector3D(0, -1, 0)
      case Axis.PositiveY:
        return new Vector3D(0, 1, 0)
      case Axis.NegativeZ:
        return new Vector3D(0, 0, -1)
      case Axis.PositiveZ:
        return new Vector3D(0, 0, 1)
    }
  }

}