import Point2D from "./point-2d";
import Vector3D from "./vector-3d";
import { SolverResult } from "./solver-result";

export default class MathUtil {

  static normalized(vector: Point2D): Point2D {
    let l = this.distance({ x: 0, y: 0 }, vector)
    if (l != 0) {
      return {
        x: vector.x / l,
        y: vector.y / l
      }
    }

    //zero length vector. really undefined, but return something anyway
    return {
      x: 0,
      y: 0
    }
  }

  static dot(a: Point2D, b: Point2D): number {
    return a.x * b.x + a.y * b.y
  }

  static difference(a: Point2D, b: Point2D): Point2D {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    }
  }

  static distance(a: Point2D, b: Point2D): number {
    let dx = a.x - b.x
    let dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  static lineSegmentMidpoint(segment: [Point2D, Point2D]): Point2D {
    return {
      x: 0.5 * (segment[0].x + segment[1].x),
      y: 0.5 * (segment[0].y + segment[1].y)
    }
  }

  static lineIntersection(line1: [Point2D, Point2D], line2: [Point2D, Point2D]): Point2D | null {
    let d1 = this.distance(line1[0], line1[1])
    let d2 = this.distance(line2[0], line2[1])

    let epsilon = 1e-8;
    if (Math.abs(d1) < epsilon || Math.abs(d2) < epsilon) {
      return null
    }

    //https://en.wikipedia.org/wiki/Line–line_intersection
    let x1 = line1[0].x
    let y1 = line1[0].y

    let x2 = line1[1].x
    let y2 = line1[1].y

    let x3 = line2[0].x
    let y3 = line2[0].y

    let x4 = line2[1].x
    let y4 = line2[1].y

    let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (Math.abs(denominator) < epsilon) {
      return null
    }

    return {
      x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator,
      y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator
    }
  }

  static triangleOrthoCenter(k: Point2D, l: Point2D, m: Point2D): Point2D {
    let a = k.x
    let b = k.y
    let c = l.x
    let d = l.y
    let e = m.x
    let f = m.y

    let N = b * c + d * e + f * a - c * f - b * e - a * d
    let x = ((d - f) * b * b + (f - b) * d * d + (b - d) * f * f + a * b * (c - e) + c * d * (e - a) + e * f * (a - c)) / N
    let y = ((e - c) * a * a + (a - e) * c * c + (c - a) * e * e + a * b * (f - d) + c * d * (b - f) + e * f * (d - b)) / N

    return {
      x: x, y: y
    }
  }

  static thirdTriangleVertex(firstVertex: Point2D, secondVertex: Point2D, orthocenter: Point2D): Point2D {
    let a = firstVertex
    let b = secondVertex
    let o = orthocenter

    //compute p, the orthogonal projection of the orthocenter onto the line through a and b
    let aToB = this.normalized({ x: b.x - a.x, y: b.y - a.y })
    let proj = this.dot(aToB, this.difference(o, a))
    let p = {
      x: a.x + proj * aToB.x,
      y: a.y + proj * aToB.y
    }

    //the vertex c can be expressed as p + hn, where n is orthogonal to ab.
    let n = { x: aToB.y, y: -aToB.x }
    let h = this.dot(this.difference(a, p), this.difference(o, b)) / (this.dot(n, this.difference(o, b)))

    return {
      x: p.x + h * n.x,
      y: p.y + h * n.y
    }
  }

  static perspectiveProject(
    point:Vector3D,
    solverResult:SolverResult
  ):Point2D {
    if (!solverResult.principalPoint) {
      return { x: 0, y: 0 }
    }
    let projected = point.copy()

    //apply camera transform
    if (solverResult.cameraTransform) {
      projected = solverResult.cameraTransform.transformedVector(projected)
    }

    //perform field of view scaling and perspective divide
    let fov = solverResult.horizontalFieldOfView!
    let s = 1 / Math.tan(0.5 * fov)
    projected.x = s * projected.x / (-projected.z) + solverResult.principalPoint.x
    projected.y = s * projected.y / (-projected.z) + solverResult.principalPoint.y

    return projected
  }

}
