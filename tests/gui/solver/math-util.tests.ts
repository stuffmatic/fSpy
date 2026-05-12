/// <reference types="jest" />
import MathUtil from '../../../src/gui/solver/math-util'
import Vector3D from '../../../src/gui/solver/vector-3d'

describe('MathUtil', () => {
  describe('dot', () => {
    test('orthogonal 2D vectors', () => {
      expect(MathUtil.dot({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(0)
    })

    test('general 2D case', () => {
      expect(MathUtil.dot({ x: 2, y: 3 }, { x: 4, y: 5 })).toBe(23)
    })
  })

  describe('difference', () => {
    test('subtracts b from a', () => {
      const result = MathUtil.difference({ x: 5, y: 7 }, { x: 2, y: 3 })
      expect(result.x).toBe(3)
      expect(result.y).toBe(4)
    })
  })

  describe('distance', () => {
    test('same point', () => {
      expect(MathUtil.distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0)
    })

    test('3-4-5 triangle', () => {
      expect(MathUtil.distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
    })

    test('horizontal distance', () => {
      expect(MathUtil.distance({ x: 0, y: 0 }, { x: 7, y: 0 })).toBe(7)
    })
  })

  describe('normalized', () => {
    test('normalizes a 2D vector to unit length', () => {
      const result = MathUtil.normalized({ x: 3, y: 4 })
      expect(result.x).toBeCloseTo(0.6, 10)
      expect(result.y).toBeCloseTo(0.8, 10)
    })

    test('zero vector returns zero', () => {
      const result = MathUtil.normalized({ x: 0, y: 0 })
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })
  })

  describe('lineSegmentMidpoint', () => {
    test('midpoint of horizontal segment', () => {
      const mid = MathUtil.lineSegmentMidpoint([{ x: 0, y: 0 }, { x: 10, y: 0 }])
      expect(mid.x).toBe(5)
      expect(mid.y).toBe(0)
    })

    test('midpoint of diagonal segment', () => {
      const mid = MathUtil.lineSegmentMidpoint([{ x: 1, y: 2 }, { x: 3, y: 4 }])
      expect(mid.x).toBe(2)
      expect(mid.y).toBe(3)
    })
  })

  describe('lineIntersection', () => {
    test('perpendicular lines through origin', () => {
      const result = MathUtil.lineIntersection(
        [{ x: -1, y: 0 }, { x: 1, y: 0 }],
        [{ x: 0, y: -1 }, { x: 0, y: 1 }]
      )
      expect(result).not.toBeNull()
      expect(result!.x).toBeCloseTo(0, 10)
      expect(result!.y).toBeCloseTo(0, 10)
    })

    test('intersecting lines at known point', () => {
      // y = x and y = -x + 4 intersect at (2, 2)
      const result = MathUtil.lineIntersection(
        [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        [{ x: 0, y: 4 }, { x: 4, y: 0 }]
      )
      expect(result).not.toBeNull()
      expect(result!.x).toBeCloseTo(2, 10)
      expect(result!.y).toBeCloseTo(2, 10)
    })

    test('parallel lines return null', () => {
      const result = MathUtil.lineIntersection(
        [{ x: 0, y: 0 }, { x: 1, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }]
      )
      expect(result).toBeNull()
    })

    test('zero-length segment returns null', () => {
      const result = MathUtil.lineIntersection(
        [{ x: 0, y: 0 }, { x: 0, y: 0 }],
        [{ x: 0, y: -1 }, { x: 0, y: 1 }]
      )
      expect(result).toBeNull()
    })
  })

  describe('triangleOrthoCenter', () => {
    test('right triangle orthocenter is at the right-angle vertex', () => {
      // Right triangle with right angle at origin
      const ortho = MathUtil.triangleOrthoCenter(
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 0, y: 3 }
      )
      expect(ortho.x).toBeCloseTo(0, 8)
      expect(ortho.y).toBeCloseTo(0, 8)
    })

    test('equilateral triangle orthocenter is at centroid', () => {
      const s = Math.sqrt(3) / 2
      const ortho = MathUtil.triangleOrthoCenter(
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0.5, y: s }
      )
      // For equilateral triangle, orthocenter = centroid
      expect(ortho.x).toBeCloseTo(0.5, 6)
      expect(ortho.y).toBeCloseTo(s / 3, 6)
    })
  })

  describe('pointsAreOnTheSameSideOfLine', () => {
    test('points on same side return true', () => {
      const result = MathUtil.pointsAreOnTheSameSideOfLine(
        { x: 0, y: 0 }, { x: 1, y: 0 }, // horizontal line
        { x: 0.5, y: 1 }, { x: 0.5, y: 2 } // both above
      )
      expect(result).toBe(true)
    })

    test('points on opposite sides return false', () => {
      const result = MathUtil.pointsAreOnTheSameSideOfLine(
        { x: 0, y: 0 }, { x: 1, y: 0 },
        { x: 0.5, y: 1 }, { x: 0.5, y: -1 }
      )
      expect(result).toBe(false)
    })
  })

  describe('linePlaneIntersection', () => {
    test('line through XY plane', () => {
      // XY plane at z=0
      const p0 = new Vector3D(0, 0, 0)
      const p1 = new Vector3D(1, 0, 0)
      const p2 = new Vector3D(0, 1, 0)
      // Line from (0,0,1) to (0,0,-1)
      const la = new Vector3D(0, 0, 1)
      const lb = new Vector3D(0, 0, -1)

      const result = MathUtil.linePlaneIntersection(p0, p1, p2, la, lb)
      expect(result.x).toBeCloseTo(0, 8)
      expect(result.y).toBeCloseTo(0, 8)
      expect(result.z).toBeCloseTo(0, 8)
    })

    test('line through offset plane', () => {
      // Plane z=2
      const p0 = new Vector3D(0, 0, 2)
      const p1 = new Vector3D(1, 0, 2)
      const p2 = new Vector3D(0, 1, 2)
      // Line from (1,1,0) to (1,1,4)
      const la = new Vector3D(1, 1, 0)
      const lb = new Vector3D(1, 1, 4)

      const result = MathUtil.linePlaneIntersection(p0, p1, p2, la, lb)
      expect(result.x).toBeCloseTo(1, 8)
      expect(result.y).toBeCloseTo(1, 8)
      expect(result.z).toBeCloseTo(2, 8)
    })
  })

  describe('shortestLineSegmentBetweenLines', () => {
    test('perpendicular skew lines', () => {
      // Line 1: along x-axis at z=0
      // Line 2: along y-axis at z=1
      const [a, b] = MathUtil.shortestLineSegmentBetweenLines(
        new Vector3D(-1, 0, 0), new Vector3D(1, 0, 0),
        new Vector3D(0, -1, 1), new Vector3D(0, 1, 1)
      )
      // Closest points should be at (0,0,0) and (0,0,1)
      expect(a.x).toBeCloseTo(0, 8)
      expect(a.y).toBeCloseTo(0, 8)
      expect(a.z).toBeCloseTo(0, 8)
      expect(b.x).toBeCloseTo(0, 8)
      expect(b.y).toBeCloseTo(0, 8)
      expect(b.z).toBeCloseTo(1, 8)
    })
  })
})
