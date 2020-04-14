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

import AABB from './aabb'
import Point2D from './point-2d'

export default class AABBOps {

  static width(aabb: AABB): number {
    return Math.abs(aabb.xMax - aabb.xMin)
  }

  static height(aabb: AABB): number {
    return Math.abs(aabb.yMax - aabb.yMin)
  }

  static maxDimension(aabb: AABB): number {
    return Math.max(this.width(aabb), this.height(aabb))
  }

  static minDimension(aabb: AABB): number {
    return Math.min(this.width(aabb), this.height(aabb))
  }

  static aspectRatio(aabb: AABB): number {
    let height = this.height(aabb)
    if (height == 0) {
      return 0
    }
    return this.width(aabb) / height
  }

  static relativePosition(aabb: AABB, xRelative: number, yRelative: number): Point2D {
    return {
      x: aabb.xMin + xRelative * this.width(aabb),
      y: aabb.yMin + yRelative * this.height(aabb)
    }
  }

  static midPoint(aabb: AABB): Point2D {
    return this.relativePosition(aabb, 0.5, 0.5)
  }

  static boundingBox(points: Point2D[], padding: number = 0): AABB {
    if (points.length == 0) {
      return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 }
    }

    let xMin = points[0].x
    let xMax = xMin
    let yMin = points[0].y
    let yMax = yMin

    for (let point of points) {
      if (point.x > xMax) {
        xMax = point.x
      } else if (point.x < xMin) {
        xMin = point.x
      }

      if (point.y > yMax) {
        yMax = point.y
      } else if (point.y < yMin) {
        yMin = point.y
      }
    }

    return {
      xMin: xMin - padding,
      yMin: yMin - padding,
      xMax: xMax + padding,
      yMax: yMax + padding
    }
  }

  /**
   * Returns the largest rect with a given aspect ratio
   * that fits inside this rect.
   * @param aspectRatio
   * @param relativeOffset
   */
  static maximumInteriorAABB(aabb: AABB, aspectRatio: number, relativeOffset: number = 0.5): AABB {

    let width = this.width(aabb)
    let height = this.height(aabb)

    if (this.aspectRatio(aabb) < aspectRatio) {
      // The rect to fit is wider than the containing rect. Cap width.
      height = this.width(aabb) / aspectRatio
    } else {
      // The rect to fit is taller than the containing rect. Cap height.
      width = this.height(aabb) * aspectRatio
    }

    let xMin = aabb.xMin + relativeOffset * (this.width(aabb) - width)
    let yMin = aabb.yMin + relativeOffset * (this.height(aabb) - height)

    return {
      xMin: xMin,
      yMin: yMin,
      xMax: xMin + width,
      yMax: yMin + height
    }
  }

  static containsPoint(aabb: AABB, point: Point2D): boolean {
    let xInside = point.x >= aabb.xMin && point.x <= aabb.xMax
    let yInside = point.y >= aabb.yMin && point.y <= aabb.yMax

    return xInside && yInside
  }

  static overlaps(aabb1: AABB, aabb2: AABB, padding: number = 0): boolean {
    let xSeparation = aabb1.xMax + padding < aabb2.xMin || aabb1.xMin - padding > aabb2.xMax
    let ySeparation = aabb1.yMax + padding < aabb2.yMin || aabb1.yMin - padding > aabb2.yMax

    return !xSeparation && !ySeparation
  }

  /**
   * Returns true if aabb1 contains aabb2, false otherwise
   * @param aabb1
   * @param aabb2
   * @param padding
   */
  static contains(aabb1: AABB, aabb2: AABB): boolean {
    let containsX = aabb1.xMin <= aabb2.xMin && aabb1.xMax >= aabb2.xMax
    let containsY = aabb1.yMin <= aabb2.yMin && aabb1.yMax >= aabb2.yMax
    return containsX && containsY
  }
}
