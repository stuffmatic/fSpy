import Point2D from "./point-2d";

export default class MathUtil {

  static distance(a: Point2D, b: Point2D): number {
    let dx = a.x - b.x
    let dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  static lineSegmentMidpoint(segment: [Point2D, Point2D]):Point2D {
    return {
      x: 0.5 * (segment[0].x + segment[1].x),
      y: 0.5 * (segment[0].y + segment[1].y)
    }
  }

  static lineIntersection(line1: [Point2D, Point2D], line2: [Point2D, Point2D]): Point2D | null {
    let d1 = this.distance(line1[0], line1[1])
    let d2 = this.distance(line2[0], line2[1])

    let epsilon = 1e-8;
    if (Math.abs(d1) < epsilon ||  Math.abs(d2) < epsilon) {
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
        x: 0.5 * (point.x / imageAspect - 1),
        y: 0.5 * point.y
      }
    }
    else {
      //wide image. [-1, 1] x [-1 / aspect, 1 / aspect] => [0, 1] x [0, 1]
      return {
        x: 0.5 * point.x,
        y: 0.5 * (point.y * imageAspect - 1)
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
}
