import Point2D from "./point-2d";
import Vector3D from "./vector-3d";
import { SolverResult } from "./solver-result";
import Transform from "./transform";

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

  static linePlaneIntersection(
    p0: Vector3D, p1: Vector3D, p2: Vector3D, la: Vector3D, lb: Vector3D
  ): Vector3D {
    //https://en.wikipedia.org/wiki/Line–plane_intersection
    let p01 = p1.subtracted(p0)
    let p02 = p2.subtracted(p0)
    let lab = lb.subtracted(la)
    let numerator = (p01.cross(p02)).dot(la.subtracted(p0))
    let denominator = -(lab.dot(p01.cross(p02)))
    let t = numerator / denominator
    return new Vector3D(
      la.x + t * lab.x,
      la.y + t * lab.y,
      la.z + t * lab.z
    )
  }

  static shortestLineSegmentBetweenLines(p1: Vector3D, p2: Vector3D, p3: Vector3D, p4: Vector3D): [Vector3D, Vector3D] {
    //TODO: gracefully handle parallel lines
    //http://paulbourke.net/geometry/pointlineplane/

    function d(m: number, n: number, o: number, p: number): number {
      //dmnop = (xm - xn)(xo - xp) + (ym - yn)(yo - yp) + (zm - zn)(zo - zp)
      let allPoints = [p1, p2, p3, p4]
      let pm = allPoints[m - 1]
      let pn = allPoints[n - 1]
      let po = allPoints[o - 1]
      let pp = allPoints[p - 1]
      return (pm.x - pn.x) * (po.x - pp.x) + (pm.y - pn.y) * (po.y - pp.y) + (pm.z - pn.z) * (po.z - pp.z)
    }

    let muaNumerator = d(1, 3, 4, 3) * d(4, 3, 2, 1) - d(1, 3, 2, 1) * d(4, 3, 4, 3)
    let muaDenominator = d(2, 1, 2, 1) * d(4, 3, 4, 3) - d(4, 3, 2, 1) * d(4, 3, 2, 1)
    let mua = muaNumerator / muaDenominator
    let mub = (d(1, 3, 4, 3) + mua * d(4, 3, 2, 1)) / d(4, 3, 4, 3)

    return [
      new Vector3D(
        p1.x + mua * (p2.x - p1.x),
        p1.y + mua * (p2.y - p1.y),
        p1.z + mua * (p2.z - p1.z)
      ),
      new Vector3D(
        p3.x + mub * (p4.x - p3.x),
        p3.y + mub * (p4.y - p3.y),
        p3.z + mub * (p4.z - p3.z)
      ),
    ]
  }

  private static modelViewProjection(solverResult: SolverResult): Transform {
    if (!solverResult.principalPoint ||
      !solverResult.cameraTransform ||
      !solverResult.principalPoint) {
      return new Transform()
    }

    let fov = solverResult.horizontalFieldOfView!
    let s = 1 / Math.tan(0.5 * fov)
    let n = 0.01
    let f = 10
    let projectionTransform = Transform.fromMatrix([
      [s, 0, -solverResult.principalPoint.x, 0],
      [0, s, -solverResult.principalPoint.y, 0],
      [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
      [0, 0, -1, 0]
    ])
    return solverResult.cameraTransform.leftMultiplied(projectionTransform)
  }

  static perspectiveUnproject(
    point: Vector3D,
    solverResult: SolverResult
  ): Vector3D {
    let transform = this.modelViewProjection(solverResult).inverted()
    return transform.transformedVector(point, true)
  }

  static perspectiveProject(
    point: Vector3D,
    solverResult: SolverResult
  ): Point2D {
    let projected = this.modelViewProjection(solverResult).transformedVector(
      point,
      true
    )
    return projected
  }

}
