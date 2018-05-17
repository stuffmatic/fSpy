import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode2VP, Axis, CalibrationSettingsBase} from "../types/calibration-settings";
import { ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState, ControlPointsStateBase } from "../types/control-points-state";
import { ImageState } from "../types/image-state";
import MathUtil from "./math-util";
import Point2D from "./point-2d";
import Transform from "./transform";
import Vector3D from "./vector-3d";
import CoordinatesUtil, { ImageCoordinateFrame } from "./coordinates-util";
import { SolverResult } from "./solver-result";
import { defaultSolverResult } from "../defaults/solver-result";


/*
The solver handles estimation of focal length and camera orientation
from input line segments. All sections numbers, equations numbers etc
refer to "Using Vanishing Points for Camera Calibration and Coarse 3D Reconstruction
from a Single Image" by E. Guillou, D. Meneveaux, E. Maisel, K. Bouatouch.
(http://www.irisa.fr/prive/kadi/Reconstruction/paper.ps.gz).
*/
export default class Solver {

  static solve1VP(
    settings: CalibrationSettings1VP,
    controlPoints: ControlPointsState1VP,
    image: ImageState
  ): SolverResult {
    let result = this.blankSolverResult()

    let errors = this.validateImage(image)
    if (errors.length > 0) {
      result.errors = errors
      return result
    }

    let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(
      image,
      controlPoints.vanishingPoints,
      errors
    )

    if (!inputVanishingPoints) {
      result.errors = errors
      return result
    }

    //Flat horizon by default
    /*
    let horizon:Point2D = {x: 1, y: 0}
    if (settings.horizonMode == HorizonMode.Manual) {
      let horizonStart = CoordinatesUtil.convert(
        controlPoints.horizon[0],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        image.width!,
        image.height!
      )
      let horizonEnd = CoordinatesUtil.convert(
        controlPoints.horizon[0],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        image.width!,
        image.height!
      )

      horizon = MathUtil.normalized({
        x: horizonEnd.x - horizonStart.x,
        y: horizonEnd.y - horizonStart.y
      })
    }


    let secondVanishingPoint = this.computeSecondVanishingPoint(
      inputVanishingPoints[0],
      relativeFocal
    )*/

    result.cameraTransform = new Transform()
    result.vanishingPoints = [inputVanishingPoints[0], { x: 0, y: 0 }, { x: 0, y: 0 }]
    result.horizontalFieldOfView = 0
    result.verticalFieldOfView = 0
    result.relativeFocalLength = 0

    return result
  }

  static solve2VP(
    settings: CalibrationSettings2VP,
    controlPoints: ControlPointsState2VP,
    image: ImageState
  ): SolverResult {
    let result = this.blankSolverResult()

    let errors = this.validateImage(image)
    if (errors.length > 0) {
      result.errors = errors
      return result
    }


    //TODO: clean up this cloning
    let vanishingPointControlStates: VanishingPointControlState[] = [
      {
        lineSegments: [
          [
            { ...controlPoints.vanishingPoints[0].lineSegments[0][0] },
            { ...controlPoints.vanishingPoints[0].lineSegments[0][1] }
          ],
          [
            { ...controlPoints.vanishingPoints[0].lineSegments[1][0] },
            { ...controlPoints.vanishingPoints[0].lineSegments[1][1] }
          ]
        ]
      },
      {
        lineSegments: [
          [
            { ...controlPoints.vanishingPoints[1].lineSegments[0][0] },
            { ...controlPoints.vanishingPoints[1].lineSegments[0][1] }
          ],
          [
            { ...controlPoints.vanishingPoints[0].lineSegments[1][0] },
            { ...controlPoints.vanishingPoints[0].lineSegments[1][1] }
          ]
        ]
      }
    ]

    if (settings.quadModeEnabled) {
      vanishingPointControlStates[1].lineSegments[0][0] = controlPoints.vanishingPoints[0].lineSegments[1][0]
      vanishingPointControlStates[1].lineSegments[0][1] = controlPoints.vanishingPoints[0].lineSegments[0][0]
      vanishingPointControlStates[1].lineSegments[1][0] = controlPoints.vanishingPoints[0].lineSegments[1][1]
      vanishingPointControlStates[1].lineSegments[1][1] = controlPoints.vanishingPoints[0].lineSegments[0][1]
    }

    //Compute the two input vanishing points from the provided control points
    let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(
      image,
      controlPoints.vanishingPoints,
      errors
    )

    if (!inputVanishingPoints) {
      result.errors = errors
      return result
    }

    //Get the principal point

    let principalPoint = { x: 0, y: 0 }
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
        let vanishingPointz = this.computeVanishingPointsFromControlPoints(image, [controlPoints.vanishingPoints[2]], errors)
        if (vanishingPointz) {
          let thirdVanishingPoint = vanishingPointz[0]
          principalPoint = MathUtil.triangleOrthoCenter(
            inputVanishingPoints[0], inputVanishingPoints[1], thirdVanishingPoint
          )
        }
        break
    }

    if (errors.length > 0) {
      result.errors = errors
      return result
    }

    result.principalPoint = principalPoint
    result.vanishingPoints = [
      inputVanishingPoints[0],
      inputVanishingPoints[1],
      MathUtil.thirdTriangleVertex(
        inputVanishingPoints[0],
        inputVanishingPoints[1],
        principalPoint
      )
    ]

    let fRelative = this.computeFocalLength(
      inputVanishingPoints[0], inputVanishingPoints[1], result.principalPoint
    )! //TODO: check for null
    result.relativeFocalLength = fRelative

    let cameraTransform = this.computeCameraRotationMatrix(
      inputVanishingPoints[0], inputVanishingPoints[1], fRelative, result.principalPoint
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

    result.cameraTransform = basisChangeTransform.leftMultiplied(cameraTransform)

    result.vanishingPointAxes = [
      settings.vanishingPointAxes[0],
      settings.vanishingPointAxes[1],
      this.vectorAxis(row3)
    ]

    result.horizontalFieldOfView = this.computeFieldOfView(
      image.width!,
      image.height!,
      fRelative,
      false
    )
    result.verticalFieldOfView = this.computeFieldOfView(
      image.width!,
      image.height!,
      fRelative,
      true
    )

    this.computeTranslationVector(
      controlPoints,
      settings,
      image.width!,
      image.height!,
      result.cameraTransform,
      result.horizontalFieldOfView,
      principalPoint,
      result.vanishingPoints,
      result.vanishingPointAxes
    )

    if (Math.abs(cameraTransform.determinant - 1) > 1e-7) {
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
   * @param Fu the first vanishing point in image plane coordinates.
   * @param Fv the second vanishing point in image plane coordinates.
   * @param P the center of projection in image plane coordinates.
   * @returns The relative focal length.
   */
  static computeFocalLength(Fu: Point2D, Fv: Point2D, P: Point2D): number | null {
    //compute Puv, the orthogonal projection of P onto FuFv
    let dirFuFv = new Vector3D(Fu.x - Fv.x, Fu.y - Fv.y).normalized()
    let FvP = new Vector3D(P.x - Fv.x, P.y - Fv.y)
    let proj = dirFuFv.dot(FvP)
    let Puv = {
      x: proj * dirFuFv.x + Fv.x,
      y: proj * dirFuFv.y + Fv.y
    }

    let PPuv = new Vector3D(P.x - Puv.x, P.y - Puv.y).length
    let FvPuv = new Vector3D(Fv.x - Puv.x, Fv.y - Puv.y).length
    let FuPuv = new Vector3D(Fu.x - Puv.x, Fu.y - Puv.y).length

    let fSq = FvPuv * FuPuv - PPuv * PPuv

    if (fSq <= 0) {
      return null
    }

    return Math.sqrt(fSq)
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
    let OFu = new Vector3D(Fu.x - P.x, Fu.y - P.y, -f)
    let OFv = new Vector3D(Fv.x - P.x, Fv.y - P.y, -f)

    let s1 = OFu.length
    let upRc = OFu.normalized()

    let s2 = OFv.length
    let vpRc = OFv.normalized()

    let wpRc = upRc.cross(vpRc)

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

  static vanishingPointIndexForAxis(positiveAxis: Axis, vanishingPointAxes: [Axis, Axis, Axis]): number {
    let negativeAxis = Axis.NegativeX
    switch (positiveAxis) {
      case Axis.PositiveY:
        negativeAxis = Axis.NegativeY
        break
      case Axis.PositiveZ:
        negativeAxis = Axis.NegativeZ
        break
    }

    for (let vpIndex = 0; vpIndex < 3; vpIndex++) {
      let vpAxis = vanishingPointAxes[vpIndex]
      if (vpAxis == positiveAxis || vpAxis == negativeAxis) {
        return vpIndex
      }
    }

    return 0
  }

  static referenceDistanceHandlesWorldPositions(
    controlPoints: ControlPointsStateBase,
    referenceAxis: Axis,
    vanishingPoints: [Point2D, Point2D, Point2D],
    vanishingPointAxes: [Axis, Axis, Axis],
    imageWidth: number,
    imageHeight: number,
    cameraTransform: Transform,
    principalPoint: Point2D,
    horizontalFieldOfView: number
  ): [Vector3D, Vector3D] {
    let handlePositionsRelative = this.referenceDistanceHandlesRelativePositions(
      controlPoints,
      referenceAxis,
      vanishingPoints,
      vanishingPointAxes,
      imageWidth,
      imageHeight
    )

    //handle positions in image plane coordinates
    let handlePositions = [
      CoordinatesUtil.convert(
        handlePositionsRelative[0],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        imageWidth,
        imageHeight
      ),
      CoordinatesUtil.convert(
        handlePositionsRelative[1],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        imageWidth,
        imageHeight
      )
    ]

    //anchor position in image plane coordinates
    let anchorPosition = CoordinatesUtil.convert(
      controlPoints.referenceDistanceAnchor,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      imageWidth,
      imageHeight
    )

    //Two vectors u, v spanning the reference plane, i.e the plane
    //perpendicular to the reference axis w
    let origin = new Vector3D()
    let u = new Vector3D()
    let v = new Vector3D()
    let w = new Vector3D()
    switch (referenceAxis) {
      case Axis.PositiveX:
        u.y = 1
        v.z = 1
        w.x = 1
        break
      case Axis.PositiveY:
        u.x = 1
        v.z = 1
        w.y = 1
        break
      case Axis.PositiveZ:
        u.x = 1
        v.y = 1
        w.z = 1
        break
    }

    //The reference distance anchor is defined to lie in the reference plane p.
    //Let rayAnchor be a ray from the camera through the anchor position in the image plane.
    //The intersection of p and rayAnchor give us two coordinate values u0 and v0.
    let rayAnchorStart = MathUtil.perspectiveUnproject(
      new Vector3D(anchorPosition.x, anchorPosition.y, 1),
      cameraTransform,
      principalPoint,
      horizontalFieldOfView
    )
    let rayAnchorEnd = MathUtil.perspectiveUnproject(
      new Vector3D(anchorPosition.x, anchorPosition.y, 2),
      cameraTransform,
      principalPoint,
      horizontalFieldOfView
    )
    let referencePlaneIntersection = MathUtil.linePlaneIntersection(
      origin, u, v,
      rayAnchorStart, rayAnchorEnd
    )

    //Compute the world positions of the reference distance handles
    let result: Vector3D[] = []

    for (let handlePosition of handlePositions) {
      let handleRayStart = MathUtil.perspectiveUnproject(
        new Vector3D(handlePosition.x, handlePosition.y, 1),
        cameraTransform,
        principalPoint,
        horizontalFieldOfView
      )
      let handleRayEnd = MathUtil.perspectiveUnproject(
        new Vector3D(handlePosition.x, handlePosition.y, 2),
        cameraTransform,
        principalPoint,
        horizontalFieldOfView
      )

      let handlePosition3D = MathUtil.shortestLineSegmentBetweenLines(
        handleRayStart,
        handleRayEnd,
        referencePlaneIntersection,
        referencePlaneIntersection.added(w)
      )[0]

      result.push(handlePosition3D)
    }

    return [result[0], result[1]]
  }

  static referenceDistanceHandlesRelativePositions(
    controlPoints: ControlPointsStateBase,
    referenceAxis: Axis,
    vanishingPoints: [Point2D, Point2D, Point2D],
    vanishingPointAxes: [Axis, Axis, Axis],
    imageWidth: number,
    imageHeight: number
  ): [Point2D, Point2D] {
    //The position of the reference distance anchor in relative coordinates
    let anchor = controlPoints.referenceDistanceAnchor
    //The index of the vanishing point corresponding to the reference axis
    let vpIndex = this.vanishingPointIndexForAxis(referenceAxis, vanishingPointAxes)
    //The position of the vanishing point in relative coordinates
    let vp = CoordinatesUtil.convert(
      vanishingPoints[vpIndex],
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      imageWidth,
      imageHeight
    )
    //A unit vector pointing from the anchor to the vanishing point
    let anchorToVp = MathUtil.normalized({ x: vp.x - anchor.x, y: vp.y - anchor.y })

    //The handles lie on the line from the anchor to the vanishing point
    let handleOffsets = controlPoints.referenceDistanceHandleOffsets
    return [
      {
        x: anchor.x + handleOffsets[0] * anchorToVp.x,
        y: anchor.y + handleOffsets[0] * anchorToVp.y,
      },
      {
        x: anchor.x + handleOffsets[1] * anchorToVp.x,
        y: anchor.y + handleOffsets[1] * anchorToVp.y,
      }
    ]
  }

  /**
   * Computes the coordinates of the second vanishing point
   * based on the first, a focal length, the center of projection and
   * the desired horizon tilt angle. The equations here are derived from
   * section 3.2 "Determining the focal length from a single image".
   * @param Fu the first vanishing point in image plane coordinates.
   * @param f the relative focal length
   * @param P the center of projection in normalized image coordinates
   * @param horizonDir The desired horizon direction
   */
  /*private static computeSecondVanishingPoint(Fu:Point2D, f:number, P:Point2D, horizonDir:Point2D):Point2D | null {
    //find the second vanishing point
    //TODO_ take principal point into account here
    if (MathUtil.distance(Fu, P) < 1e-7) { //TODO: espsilon constant
      return null
    }

    let k = -(Fu.x * Fu.x + Fu.y * Fu.y + f * f) / (Fu.x * horizonDir.x + Fu.y * horizonDir.y)
    let Fv = {
      x: Fu.x + k * horizonDir.x,
      y: Fu.y + k * horizonDir.y
    }

    return Fv
  }*/

  private static axisVector(axis: Axis): Vector3D {
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

  private static vectorAxis(vector: Vector3D): Axis {
    if (vector.x == 0 && vector.y == 0) {
      return vector.z > 0 ? Axis.PositiveZ : Axis.NegativeZ
    }
    else if (vector.x == 0 && vector.z == 0) {
      return vector.y > 0 ? Axis.PositiveY : Axis.NegativeY
    }
    else if (vector.y == 0 && vector.z == 0) {
      return vector.x > 0 ? Axis.PositiveX : Axis.NegativeX
    }

    throw "Invalid axis vector"
  }

  private static validateImage(image: ImageState): string[] {
    let errors: string[] = []
    if (image.width == null || image.height == null) {
      errors.push("No image loaded")
    }
    return errors
  }

  private static computeVanishingPointsFromControlPoints(
    image: ImageState,
    controlPointStates: VanishingPointControlState[],
    errors: string[]
  ): Point2D[] | null {
    let result: Point2D[] = []
    for (let i = 0; i < controlPointStates.length; i++) {
      let vanishingPoint = MathUtil.lineIntersection(
        controlPointStates[i].lineSegments[0],
        controlPointStates[i].lineSegments[1]
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

  private static computeTranslationVector(
    controlPoints:ControlPointsStateBase,
    settings: CalibrationSettingsBase,
    imageWidth:number,
    imageHeight:number,
    cameraTransform:Transform,
    horizontalFieldOfView:number,
    principalPoint:Point2D,
    vanishingPoints:[Point2D, Point2D, Point2D],
    vanishingPointAxes:[Axis, Axis, Axis],
  ): void {
    //The 3D origin in image plane coordinates
    let origin = CoordinatesUtil.convert(
      controlPoints.origin,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      imageWidth,
      imageHeight
    )

    let k = Math.tan(0.5 * horizontalFieldOfView)
    let origin3D = new Vector3D(
      k * (origin.x - principalPoint.x),
      k * (origin.y - principalPoint.y),
      -1
    ).multipliedByScalar(10) //TODO: make this distance a constant

    //Set a default translation vector
    cameraTransform.matrix[0][3] = origin3D.x
    cameraTransform.matrix[1][3] = origin3D.y
    cameraTransform.matrix[2][3] = origin3D.z


    if (settings.referenceDistanceAxis) {
      //If requested, scale the translation vector so that
      //the distance between the 3d handle positions equals the
      //specified reference distance

      //See what the distance between the 3d handle positions is given the current,
      //default, translation vector
      let referenceDistanceHandles3D = this.referenceDistanceHandlesWorldPositions(
        controlPoints,
        settings.referenceDistanceAxis,
        vanishingPoints,
        vanishingPointAxes,
        imageWidth,
        imageHeight,
        cameraTransform,
        principalPoint,
        horizontalFieldOfView
      )
      let defaultHandleDistance = referenceDistanceHandles3D[0].subtracted(referenceDistanceHandles3D[1]).length

      //Scale the translation vector by the ratio of the reference distance to the computed distance
      let referenceDistance = settings.referenceDistance
      let scale = referenceDistance / defaultHandleDistance
      origin3D.multiplyByScalar(scale)
    }

    cameraTransform.matrix[0][3] = origin3D.x
    cameraTransform.matrix[1][3] = origin3D.y
    cameraTransform.matrix[2][3] = origin3D.z
  }

  /**
   * Creates a blank solver result to be populated by the solver
   */
  private static blankSolverResult(): SolverResult {
    let result = { ...defaultSolverResult }
    result.errors = []
    result.warnings = []
    return result
  }
}