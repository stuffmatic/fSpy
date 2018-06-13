import { CalibrationSettings1VP, CalibrationSettings2VP, PrincipalPointMode2VP, Axis, CalibrationSettingsBase, HorizonMode, PrincipalPointMode1VP } from '../types/calibration-settings'
import { ControlPointsState1VP, ControlPointsState2VP, VanishingPointControlState, ControlPointsStateBase } from '../types/control-points-state'
import { ImageState } from '../types/image-state'
import MathUtil from './math-util'
import Point2D from './point-2d'
import Transform from './transform'
import Vector3D from './vector-3d'
import CoordinatesUtil, { ImageCoordinateFrame } from './coordinates-util'
import { SolverResult } from './solver-result'
import { defaultSolverResult } from './../defaults/solver-result'
import { cameraPresets } from './camera-presets'

/**
 * The solver handles estimation of focal length and camera orientation
 * from given vanishing points. Sections numbers, equations numbers etc
 * refer to "Using Vanishing Points for Camera Calibration and Coarse 3D Reconstruction
 * from a Single Image" by E. Guillou, D. Meneveaux, E. Maisel, K. Bouatouch.
 * @see http://www.irisa.fr/prive/kadi/Reconstruction/paper.ps.gz
 */
export default class Solver {

  /**
   * Estimates camera parameters given a single vanishing point, a
   * relative focal length and an optional horizon direction
   * @param settings
   * @param controlPoints
   * @param image
   */
  static solve1VP(
    settingsBase: CalibrationSettingsBase,
    settings1VP: CalibrationSettings1VP,
    controlPointsBase: ControlPointsStateBase,
    controlPoints1VP: ControlPointsState1VP,
    image: ImageState
  ): SolverResult {
    // Create a blank result object
    let result = this.blankSolverResult()

    // Bail out if we don't have valid image dimensions
    result.errors = this.validateImageDimensions(image)
    if (result.errors.length > 0) {
      return result
    }

    let imageWidth = image.width!
    let imageHeight = image.height!

    // Compute a relative focal length from the provided absolute focal length and sensor size
    let absoluteFocalLength = settings1VP.absoluteFocalLength
    let sensorWidth = settingsBase.cameraData.customSensorWidth
    let sensorHeight = settingsBase.cameraData.customSensorHeight
    let presetId = settingsBase.cameraData.presetId
    if (presetId) {
      let preset = cameraPresets[presetId]
      sensorWidth = preset.sensorWidth
      sensorHeight = preset.sensorHeight
    }
    let relativeFocalLength = 0
    let sensorAspectRatio = sensorWidth / sensorHeight
    if (sensorAspectRatio > 1) {
      // wide sensor.
      relativeFocalLength = absoluteFocalLength / sensorWidth
    } else {
      // tall sensor
      relativeFocalLength = absoluteFocalLength / sensorHeight
    }

    if (Math.abs(sensorAspectRatio - imageWidth / imageHeight) > 0.01) { // TODO: choose epsilon
      result.warnings.push('Image/sensor aspect ratio mismatch')
    }

    // Compute the input vanishing point in image plane coordinates
    let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(
      image,
      [controlPointsBase.firstVanishingPoint],
      result.errors
    )

    if (result.errors.length > 0) {
      // Something went wrong computing the vanishing point. Nothing further.
      return result
    }

    // Get the principal point
    let principalPoint = { x: 0, y: 0 }
    if (settings1VP.principalPointMode == PrincipalPointMode1VP.Manual) {
      principalPoint = CoordinatesUtil.convert(
        controlPointsBase.principalPoint,
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        imageWidth,
        imageHeight
      )
    }

    // Compute the horizon direction
    let horizonDirection: Point2D = { x: 1, y: 0 } // flat by default
    if (settings1VP.horizonMode == HorizonMode.Manual) {
      // Compute two points on the horizon line in image plane coordinates
      let horizonStart = CoordinatesUtil.convert(
        controlPoints1VP.horizon[0],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        imageWidth,
        imageHeight
      )
      let horizonEnd = CoordinatesUtil.convert(
        controlPoints1VP.horizon[1],
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        imageWidth,
        imageHeight
      )

      // Normalized horizon direction vector
      horizonDirection = MathUtil.normalized({
        x: horizonEnd.x - horizonStart.x,
        y: horizonEnd.y - horizonStart.y
      })
    }

    let secondVanishingPoint = this.computeSecondVanishingPoint(
      inputVanishingPoints![0],
      relativeFocalLength,
      principalPoint,
      horizonDirection
    )

    if (secondVanishingPoint === null) {
      result.errors.push('Failed to compute second vanishing point')
      return result
    }

    // TODO: assign axes
    let axisAssignmentMatrix = new Transform()
    result.vanishingPointAxes = [
      Axis.PositiveX,
      Axis.PositiveY,
      Axis.PositiveZ
    ]

    this.computeCameraParameters(
      result,
      controlPointsBase,
      settingsBase,
      axisAssignmentMatrix,
      principalPoint,
      inputVanishingPoints![0],
      secondVanishingPoint,
      relativeFocalLength,
      imageWidth,
      imageHeight
    )

    return result
  }

  static solve2VP(
    settingsBase: CalibrationSettingsBase,
    settings2VP: CalibrationSettings2VP,
    controlPointsBase: ControlPointsStateBase,
    controlPoints2VP: ControlPointsState2VP,
    image: ImageState
  ): SolverResult {
    let result = this.blankSolverResult()

    let errors = this.validateImageDimensions(image)
    if (errors.length > 0) {
      result.errors = errors
      return result
    }
    let imageWidth = image.width!
    let imageHeight = image.height!

    let firstVanishingPointControlState = controlPointsBase.firstVanishingPoint
    let secondVanishingPointControlState = controlPoints2VP.secondVanishingPoint
    if (settings2VP.quadModeEnabled) {
      secondVanishingPointControlState = {
        lineSegments: [
          [
            firstVanishingPointControlState.lineSegments[0][0],
            firstVanishingPointControlState.lineSegments[1][0]
          ],
          [
            firstVanishingPointControlState.lineSegments[0][1],
            firstVanishingPointControlState.lineSegments[1][1]
          ]
        ]
      }
    }

    // Compute the two input vanishing points from the provided control points
    let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(
      image,
      [controlPointsBase.firstVanishingPoint, secondVanishingPointControlState],
      errors
    )

    if (!inputVanishingPoints) {
      result.errors = errors
      return result
    }

    // Get the principal point
    let principalPoint = { x: 0, y: 0 }
    switch (settings2VP.principalPointMode) {
      case PrincipalPointMode2VP.Manual:
        principalPoint = CoordinatesUtil.convert(
          controlPointsBase.principalPoint,
          ImageCoordinateFrame.Relative,
          ImageCoordinateFrame.ImagePlane,
          image.width!,
          image.height!
        )
        break
      case PrincipalPointMode2VP.FromThirdVanishingPoint:
        let thirdVanishingPointArray = this.computeVanishingPointsFromControlPoints(
          image,
          [controlPoints2VP.thirdVanishingPoint],
          errors
        )
        if (thirdVanishingPointArray) {
          let thirdVanishingPoint = thirdVanishingPointArray[0]
          principalPoint = MathUtil.triangleOrthoCenter(
            inputVanishingPoints[0], inputVanishingPoints[1], thirdVanishingPoint
          )
        }
        break
    }

    let fRelative = this.computeFocalLength(
      inputVanishingPoints[0], inputVanishingPoints[1], principalPoint
    )

    if (fRelative === null) {
      result.errors.push('Failed to compute focal length')
      return result
    }

    // Assing vanishing point axes
    let axisAssignmentMatrix = new Transform()
    let row1 = this.axisVector(settingsBase.firstVanishingPointAxis)
    let row2 = this.axisVector(settingsBase.secondVanishingPointAxis)
    let row3 = row1.cross(row2)
    axisAssignmentMatrix.matrix[0][0] = row1.x
    axisAssignmentMatrix.matrix[0][1] = row1.y
    axisAssignmentMatrix.matrix[0][2] = row1.z
    axisAssignmentMatrix.matrix[1][0] = row2.x
    axisAssignmentMatrix.matrix[1][1] = row2.y
    axisAssignmentMatrix.matrix[1][2] = row2.z
    axisAssignmentMatrix.matrix[2][0] = row3.x
    axisAssignmentMatrix.matrix[2][1] = row3.y
    axisAssignmentMatrix.matrix[2][2] = row3.z

    result.vanishingPointAxes = [
      settingsBase.firstVanishingPointAxis,
      settingsBase.secondVanishingPointAxis,
      this.vectorAxis(row3)
    ]

    // compute camera parameters
    this.computeCameraParameters(
      result,
      controlPointsBase,
      settingsBase,
      axisAssignmentMatrix,
      principalPoint,
      inputVanishingPoints[0],
      inputVanishingPoints[1],
      fRelative,
      imageWidth,
      imageHeight
    )

    return result
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
    // compute Puv, the orthogonal projection of P onto FuFv
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

    // handle positions in image plane coordinates
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

    // anchor position in image plane coordinates
    let anchorPosition = CoordinatesUtil.convert(
      controlPoints.referenceDistanceAnchor,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane,
      imageWidth,
      imageHeight
    )

    // Two vectors u, v spanning the reference plane, i.e the plane
    // perpendicular to the reference axis w
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

    // The reference distance anchor is defined to lie in the reference plane p.
    // Let rayAnchor be a ray from the camera through the anchor position in the image plane.
    // The intersection of p and rayAnchor give us two coordinate values u0 and v0.
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

    // Compute the world positions of the reference distance handles
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
    // The position of the reference distance anchor in relative coordinates
    let anchor = controlPoints.referenceDistanceAnchor
    // The index of the vanishing point corresponding to the reference axis
    let vpIndex = this.vanishingPointIndexForAxis(referenceAxis, vanishingPointAxes)
    // The position of the vanishing point in relative coordinates
    let vp = CoordinatesUtil.convert(
      vanishingPoints[vpIndex],
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      imageWidth,
      imageHeight
    )
    // A unit vector pointing from the anchor to the vanishing point
    let anchorToVp = MathUtil.normalized({ x: vp.x - anchor.x, y: vp.y - anchor.y })

    // The handles lie on the line from the anchor to the vanishing point
    let handleOffsets = controlPoints.referenceDistanceHandleOffsets
    return [
      {
        x: anchor.x + handleOffsets[0] * anchorToVp.x,
        y: anchor.y + handleOffsets[0] * anchorToVp.y
      },
      {
        x: anchor.x + handleOffsets[1] * anchorToVp.x,
        y: anchor.y + handleOffsets[1] * anchorToVp.y
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
  private static computeSecondVanishingPoint(Fu: Point2D, f: number, P: Point2D, horizonDir: Point2D): Point2D | null {
    // find the second vanishing point
    // TODO_ take principal point into account here
    if (MathUtil.distance(Fu, P) < 1e-7) { // TODO: espsilon constant
      return null
    }

    let k = -(Fu.x * Fu.x + Fu.y * Fu.y + f * f) / (Fu.x * horizonDir.x + Fu.y * horizonDir.y)
    let Fv = {
      x: Fu.x + k * horizonDir.x,
      y: Fu.y + k * horizonDir.y
    }

    return Fv
  }

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
    } else if (vector.x == 0 && vector.z == 0) {
      return vector.y > 0 ? Axis.PositiveY : Axis.NegativeY
    } else if (vector.y == 0 && vector.z == 0) {
      return vector.x > 0 ? Axis.PositiveX : Axis.NegativeX
    }

    throw new Error('Invalid axis vector')
  }

  private static validateImageDimensions(image: ImageState): string[] {
    let errors: string[] = []
    if (image.width === null || image.height === null) {
      errors.push('No image loaded')
    }
    return errors
  }

  /**
   * Computes vanishing points in image plane coordinates given a set of
   * vanishing point control points.
   * @param image
   * @param controlPointStates
   * @param errors
   */
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
      } else {
        errors.push('Failed to compute vanishing point')
      }
    }

    return errors.length == 0 ? result : null
  }

  private static computeTranslationVector(
    controlPoints: ControlPointsStateBase,
    settings: CalibrationSettingsBase,
    imageWidth: number,
    imageHeight: number,
    cameraTransform: Transform,
    horizontalFieldOfView: number,
    principalPoint: Point2D,
    vanishingPoints: [Point2D, Point2D, Point2D],
    vanishingPointAxes: [Axis, Axis, Axis]
  ): void {
    // The 3D origin in image plane coordinates
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
    ).multipliedByScalar(10) // TODO: make this distance a constant

    // Set a default translation vector
    cameraTransform.matrix[0][3] = origin3D.x
    cameraTransform.matrix[1][3] = origin3D.y
    cameraTransform.matrix[2][3] = origin3D.z

    if (settings.referenceDistanceAxis) {
      // If requested, scale the translation vector so that
      // the distance between the 3d handle positions equals the
      // specified reference distance

      // See what the distance between the 3d handle positions is given the current,
      // default, translation vector
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

      // Scale the translation vector by the ratio of the reference distance to the computed distance
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

  private static computeFieldOfView(
    imageWidth: number,
    imageHeight: number,
    fRelative: number,
    vertical: boolean
  ): number {
    let aspectRatio = imageWidth / imageHeight
    let d = 2
    if (aspectRatio < 1) {
      // tall image
      if (!vertical) {
        d = 2 * aspectRatio
      }
    } else {
      // wide image
      if (vertical) {
        d = 2 / aspectRatio
      }
    }

    return 2 * Math.atan(d / (2 * fRelative))
  }

  private static computeCameraParameters(
    result: SolverResult,
    controlPoints: ControlPointsStateBase,
    settings: CalibrationSettingsBase,
    axisAssignmentMatrix: Transform,
    principalPoint: Point2D,
    vp1: Point2D,
    vp2: Point2D,
    relativeFocalLength: number,
    imageWidth: number,
    imageHeight: number
  ) {
    // principal point
    result.principalPoint = principalPoint
    // focal length
    result.relativeFocalLength = relativeFocalLength
    // vanishing points
    result.vanishingPoints = [
      vp1,
      vp2,
      MathUtil.thirdTriangleVertex(
        vp1,
        vp2,
        principalPoint
      )
    ]
    // horizontal field of view
    result.horizontalFieldOfView = this.computeFieldOfView(
      imageWidth,
      imageHeight,
      relativeFocalLength,
      false
    )
    // vertical field of view
    result.verticalFieldOfView = this.computeFieldOfView(
      imageWidth,
      imageHeight,
      relativeFocalLength,
      true
    )

    // compute camera rotation matrix
    let cameraRotationMatrix = this.computeCameraRotationMatrix(
      vp1, vp2, relativeFocalLength, principalPoint
    )
    if (Math.abs(cameraRotationMatrix.determinant - 1) > 1e-7) {
      result.warnings.push('Camera rotation matrix has non-unit determinant ' + cameraRotationMatrix.determinant.toFixed(5))
    }

    result.cameraTransform = axisAssignmentMatrix.leftMultiplied(cameraRotationMatrix)

    this.computeTranslationVector(
      controlPoints,
      settings,
      imageWidth,
      imageHeight,
      result.cameraTransform,
      result.horizontalFieldOfView,
      principalPoint,
      result.vanishingPoints,
      result.vanishingPointAxes!
    )
  }
}
