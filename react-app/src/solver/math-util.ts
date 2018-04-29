import Point2D from "./point-2d";

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

  static relativeToImagePlaneCoords(point: Point2D, imageWidth: number, imageHeight: number): Point2D {
    let aspectRatio = imageWidth / imageHeight
    if (aspectRatio <= 1) {
      //tall image. [0, 1] x [0, 1] => [-aspect, aspect] x [-1, 1]
      return {
        x: (-1 + 2 * point.x) * aspectRatio,
        y: -1 + 2 * point.y
      }
    }
    else {
      //wide image. [0, 1] x [0, 1] => [-1, 1] x [-1 / aspect, 1 / aspect]
      return {
        x: -1 + 2 * point.x,
        y: (-1 + 2 * point.y) / aspectRatio
      }
    }
  }

  static imagePlaneCoordsToRelative(point: Point2D, imageWidth: number, imageHeight: number): Point2D {
    let imageAspect = imageWidth / imageHeight
    if (imageAspect <= 1) {
      //tall image. [-aspect, aspect] x [-1, 1] => [0, 1] x [0, 1]
      return {
        x: 0.5 * (point.x / imageAspect + 1),
        y: 0.5 * (point.y + 1)
      }
    }
    else {
      //wide image. [-1, 1] x [-1 / aspect, 1 / aspect] => [0, 1] x [0, 1]
      return {
        x: 0.5 * (point.x + 1),
        y: 0.5 * (point.y * imageAspect + 1)
      }
    }
  }

  static absoluteToRelativeImageCoords(point: Point2D, imageWidth: number, imageHeight: number): Point2D {
    return {
      x: point.x / imageWidth,
      y: point.y / imageHeight,
    }
  }

  static relativeToAbsoluteImageCoords(point: Point2D, imageWidth: number, imageHeight: number): Point2D {
    return {
      x: point.x * imageWidth,
      y: point.y * imageHeight,
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
}
