/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Point2D from './point-2d'
import Vector3D from './vector-3d'
import AABB from './aabb'
import AABBOps from './aabb-ops'

export default class Transform {
  private rows: number[][]

  constructor() {
    this.rows = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]
  }

  static lookatTransform(lookFrom: Vector3D, lookAt: Vector3D, up: Vector3D): Transform {
    let forward = lookAt.subtracted(lookFrom).normalized()
    let right = forward.cross(up).normalized()
    let u = right.cross(forward)

    return Transform.fromMatrix(
      [
        [right.x, u.x, -forward.x, lookFrom.x],
        [right.y, u.y, -forward.y, lookFrom.y],
        [right.z, u.z, -forward.z, lookFrom.z],
        [0, 0, 0, 1]
      ]
    ).inverted()
  }

  static perspectiveProjection(fieldOfView: number, near: number, far: number): Transform {
    // http://www.songho.ca/opengl/gl_projectionmatrix.html
    let s = 1 / Math.tan(0.5 * fieldOfView)
    return Transform.fromMatrix(
      [
        [s, 0, 0, 0],
        [0, s, 0, 0],
        [0, 0, -(far) / (far - near), -far * near / (far - near)],
        [0, 0, -1, 0]
      ]
    )
  }

  static fromMatrix(matrix: number[][]): Transform {
    let transform = new Transform()
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      if (rowIndex >= matrix.length) {
        continue
      }
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (columnIndex >= matrix[rowIndex].length) {
          break
        }

        transform.rows[rowIndex][columnIndex] = matrix[rowIndex][columnIndex]
      }
    }
    return transform
  }

  static rotation(angle: number, xAxis: number = 0, yAxis: number = 0, zAxis: number = 1): Transform {
    // https://en.wikipedia.org/wiki/Rotation_matrix
    let axis = new Vector3D(xAxis, yAxis, zAxis).normalized()
    let transform = new Transform()
    transform.rows[0][0] = Math.cos(angle) + axis.x * axis.x * (1 - Math.cos(angle))
    transform.rows[0][1] = axis.x * axis.y * (1 - Math.cos(angle)) - axis.z * Math.sin(angle)
    transform.rows[0][2] = axis.x * axis.z * (1 - Math.cos(angle)) + axis.y * Math.sin(angle)

    transform.rows[1][0] = axis.y * axis.x * (1 - Math.cos(angle)) + axis.z * Math.sin(angle)
    transform.rows[1][1] = Math.cos(angle) + axis.y * axis.y * (1 - Math.cos(angle))
    transform.rows[1][2] = axis.y * axis.z * (1 - Math.cos(angle)) - axis.x * Math.sin(angle)

    transform.rows[2][0] = axis.z * axis.x * (1 - Math.cos(angle)) - axis.y * Math.sin(angle)
    transform.rows[2][1] = axis.z * axis.y * (1 - Math.cos(angle)) + axis.x * Math.sin(angle)
    transform.rows[2][2] = Math.cos(angle) + axis.z * axis.z * (1 - Math.cos(angle))

    return transform
  }

  static scale(sx: number, sy: number, sz: number = 0): Transform {
    let transform = new Transform()
    transform.rows[0][0] = sx
    transform.rows[1][1] = sy
    transform.rows[2][2] = sz
    return transform
  }

  static translation(dx: number, dy: number, dz: number = 0): Transform {
    let transform = new Transform()
    transform.rows[0][3] = dx
    transform.rows[1][3] = dy
    transform.rows[2][3] = dz
    return transform
  }

  static skew2D(xAngle: number, yAngle: number): Transform {
    let transform = new Transform()
    transform.rows[0][1] = Math.tan(xAngle)
    transform.rows[1][0] = Math.tan(yAngle)
    return transform
  }

  /**
   * Concatenates a number of transforms. [A, B, C] => ABC
   * @param transforms [a, b, c]
   */
  static concatenate(transforms: Transform[]): Transform {
    let result = new Transform()
    for (let i = 0; i < transforms.length; i++) {
      let transform = transforms[transforms.length - 1 - i]
      result.leftMultiply(transform)
    }
    return result
  }

  copy(): Transform {
    let copy = new Transform()
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        copy.matrix[rowIndex][columnIndex] = this.rows[rowIndex][columnIndex]
      }
    }

    return copy
  }

  get matrix(): number[][] {
    return this.rows
  }

  get isIdentity(): boolean {
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rows.length; columnIndex++) {
        let expectedValue = rowIndex == columnIndex ? 1 : 0
        if (this.rows[rowIndex][columnIndex] != expectedValue) {
          return false
        }
      }
    }

    return true
  }

  get isDiagonal(): boolean {
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rows.length; columnIndex++) {
        if (rowIndex == columnIndex) {
          if (this.rows[rowIndex][columnIndex] == 0) {
            return false
          }
        } else {
          if (this.rows[rowIndex][columnIndex] != 0) {
            return false
          }
        }
      }
    }

    return true
  }

  get determinant(): number {
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm
    let m = this.matrix
    let m00 = m[0][0]
    let m01 = m[0][1]
    let m02 = m[0][2]
    let m03 = m[0][3]

    let m10 = m[1][0]
    let m11 = m[1][1]
    let m12 = m[1][2]
    let m13 = m[1][3]

    let m20 = m[2][0]
    let m21 = m[2][1]
    let m22 = m[2][2]
    let m23 = m[2][3]

    let m30 = m[3][0]
    let m31 = m[3][1]
    let m32 = m[3][2]
    let m33 = m[3][3]

    let result =
      m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
      m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
      m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
      m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
      m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
      m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33
    return result
  }

  invert(): void {
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    let m = this.matrix
    let m00 = m[0][0]
    let m01 = m[0][1]
    let m02 = m[0][2]
    let m03 = m[0][3]

    let m10 = m[1][0]
    let m11 = m[1][1]
    let m12 = m[1][2]
    let m13 = m[1][3]

    let m20 = m[2][0]
    let m21 = m[2][1]
    let m22 = m[2][2]
    let m23 = m[2][3]

    let m30 = m[3][0]
    let m31 = m[3][1]
    let m32 = m[3][2]
    let m33 = m[3][3]

    let s = 1 / this.determinant

    this.rows[0][0] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33
    this.rows[0][1] = m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33
    this.rows[0][2] = m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33
    this.rows[0][3] = m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23
    this.rows[1][0] = m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33
    this.rows[1][1] = m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33
    this.rows[1][2] = m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33
    this.rows[1][3] = m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23
    this.rows[2][0] = m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33
    this.rows[2][1] = m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33
    this.rows[2][2] = m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33
    this.rows[2][3] = m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23
    this.rows[3][0] = m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32
    this.rows[3][1] = m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32
    this.rows[3][2] = m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32
    this.rows[3][3] = m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        this.rows[rowIndex][columnIndex] *= s
      }
    }
  }

  inverted(): Transform {
    let result = this.copy()
    result.invert()
    return result
  }

  transpose(): void {
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {
        let lowerValue = this.rows[rowIndex][columnIndex]
        let upperValue = this.rows[columnIndex][rowIndex]

        this.rows[rowIndex][columnIndex] = upperValue
        this.rows[columnIndex][rowIndex] = lowerValue
      }
    }
  }

  transposed(): Transform {
    let result = this.copy()
    result.transpose()
    return result
  }

  transformVector(vector: Vector3D, perspectiveDivide = false, targetRect: AABB | null = null): void {
    let result = this.transform([vector.x, vector.y, vector.z, 1])

    vector.x = result[0]
    vector.y = result[1]
    vector.z = result[2]

    if (perspectiveDivide) {
      vector.x /= result[3]
      vector.y /= result[3]
      vector.z /= result[3]
    }

    if (targetRect) {
      vector.x = 0.5 * AABBOps.width(targetRect) * vector.x + AABBOps.midPoint(targetRect).x
      vector.y = -0.5 * AABBOps.height(targetRect) * vector.y + AABBOps.midPoint(targetRect).y
    }
  }

  transformedVector(vector: Vector3D, perspectiveDivide = false): Vector3D {
    let copy = vector.copy()
    this.transformVector(copy, perspectiveDivide)
    return copy
  }

  transformVectors(vectors: Vector3D[]): void {
    for (let vector of vectors) {
      this.transformVector(vector)
    }
  }

  transformedVectors(vectors: Vector3D[]): Vector3D[] {
    let result: Vector3D[] = []
    for (let vector of vectors) {
      result.push(this.transformedVector(vector))
    }
    return result
  }

  transform2DPoint(point: Point2D): void {
    let result = this.transform([point.x, point.y, 0, 1])
    point.x = result[0]
    point.y = result[1]
  }

  transform2DPoints(points: Point2D[]): void {
    for (let point of points) {
      this.transform2DPoint(point)
    }
  }

  transformed2DPoint(point: Point2D): Point2D {
    let result = this.transform([point.x, point.y, 0, 1])
    return {
      x: result[0],
      y: result[1]
    }
  }

  transformed2DPoints(points: Point2D[]): Point2D[] {
    let result: Point2D[] = []
    for (let point of points) {
      result.push(this.transformed2DPoint(point))
    }
    return result
  }

  equals(transform: Transform, epsilon: number = 0): boolean {
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.rows[rowIndex].length; columnIndex++) {
        let thisValue = this.rows[rowIndex][columnIndex]
        let otherValue = transform.rows[rowIndex][columnIndex]
        if (epsilon == 0) {
          if (thisValue != otherValue) {
            return false
          }
        } else {
          if (Math.abs(thisValue - otherValue) > epsilon) {
            return false
          }
        }
      }
    }

    return true
  }

  translate(dx: number, dy: number, dz: number = 0): void {
    this.rows[0][3] += dx
    this.rows[1][3] += dy
    this.rows[2][3] += dz
  }

  translated(dx: number, dy: number, dz: number = 0): Transform {
    let transform = this.copy()
    transform.translate(dx, dy, dz)
    return transform
  }

  scale(sx: number, sy: number, sz: number = 0): void {
    this.rows[0][0] *= sx
    this.rows[1][1] *= sy
    this.rows[2][2] *= sz
  }

  scaled(sx: number, sy: number, sz: number = 0): Transform {
    let transform = this.copy()
    transform.scale(sx, sy, sz)
    return transform
  }

  scaleUniform(s: number): void {
    this.rows[0][0] *= s
    this.rows[1][1] *= s
    this.rows[2][2] *= s
  }

  scaledUniform(s: number): Transform {
    let transform = this.copy()
    transform.scale(s, s, s)
    return transform
  }

  rotate(angle: number, xAxis: number = 0, yAxis: number = 0, zAxis: number = 1): void {
    let rotationTransform = Transform.rotation(angle, xAxis, yAxis, zAxis)
    this.leftMultiply(rotationTransform)
  }

  rotated(angle: number, xAxis: number = 0, yAxis: number = 0, zAxis: number = 1): Transform {
    let transform = this.copy()
    transform.rotate(angle, xAxis, yAxis, zAxis)
    return transform
  }

  /**
   * result = transform * this
   * @param transform
   */
  leftMultiply(transform: Transform): void {
    let result = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        let sum = 0

        for (let srcRow = 0; srcRow < 4; srcRow++) {
          sum += this.rows[srcRow][columnIndex] * transform.rows[rowIndex][srcRow]
        }

        result[rowIndex][columnIndex] = sum
      }
    }

    this.rows = result
  }

  leftMultiplied(transform: Transform): Transform {
    let result = this.copy()
    result.leftMultiply(transform)
    return result
  }

  get svgString(): string {
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform
    // matrix(<a> <b> <c> <d> <e> <f>)
    // a c e
    // b d f
    // 0 0 1
    //
    // a c * e
    // b d * f
    // * * * *
    // 0 0 0 1
    let a = this.rows[0][0]
    let b = this.rows[1][0]
    let c = this.rows[0][1]
    let d = this.rows[1][1]
    let e = this.rows[0][3]
    let f = this.rows[1][3]

    return 'matrix(' + a + ' ' + b + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ')'
  }

  private transform(vector: number[]): number[] {
    let result: number[] = []
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      let coord = 0
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        coord += this.rows[rowIndex][columnIndex] * vector[columnIndex]
      }
      result.push(coord)
    }

    return result
  }
}
