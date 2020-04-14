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

export default class Vector3D {
  x: number
  y: number
  z: number

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  copy(): Vector3D {
    return new Vector3D(this.x, this.y, this.z)
  }

  get minCoordinate(): number {
    return Math.min(this.x, this.y, this.z)
  }

  get maxCoordinate(): number {
    return Math.max(this.x, this.y, this.z)
  }

  get minAbsCoordinate(): number {
    return Math.min(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z)
    )
  }

  get maxAbsCoordinate(): number {
    return Math.max(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z)
    )
  }

  add(other: Vector3D) {
    this.x += other.x
    this.y += other.y
    this.z += other.z
  }

  added(other: Vector3D): Vector3D {
    let result = this.copy()
    result.add(other)
    return result
  }

  subtract(other: Vector3D) {
    this.x -= other.x
    this.y -= other.y
    this.z -= other.z
  }

  subtracted(other: Vector3D): Vector3D {
    let result = this.copy()
    result.subtract(other)
    return result
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  /**
   * Normalizes the vector and returns the length prior to normalization.
   */
  normalize(): number {
    let length = this.length
    if (length > 0) {
      this.x /= length
      this.y /= length
      this.z /= length
    }

    return length
  }

  normalized(): Vector3D {
    let result = this.copy()
    result.normalize()
    return result
  }

  negate() {
    this.x = -this.x
    this.y = -this.y
    this.z = -this.z
  }

  negated(): Vector3D {
    let result = this.copy()
    result.negate()
    return result
  }

  multiplyByScalar(scalar: number) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar
  }

  multipliedByScalar(scalar: number): Vector3D {
    let result = this.copy()
    result.multiplyByScalar(scalar)
    return result
  }

  /**
   * Dot product this * other
   * @param other
   */
  dot(other: Vector3D): number {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  /**
   * Cross product this x other
   * @param other
   */
  cross(other: Vector3D): Vector3D {
    return new Vector3D(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    )
  }
}
