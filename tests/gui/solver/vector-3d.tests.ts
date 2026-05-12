/// <reference types="jest" />
import Vector3D from '../../../src/gui/solver/vector-3d'

describe('Vector3D', () => {
  describe('constructor', () => {
    test('defaults to zero vector', () => {
      const v = new Vector3D()
      expect(v.x).toBe(0)
      expect(v.y).toBe(0)
      expect(v.z).toBe(0)
    })

    test('sets components', () => {
      const v = new Vector3D(1, 2, 3)
      expect(v.x).toBe(1)
      expect(v.y).toBe(2)
      expect(v.z).toBe(3)
    })
  })

  describe('copy', () => {
    test('returns independent copy', () => {
      const v = new Vector3D(1, 2, 3)
      const c = v.copy()
      c.x = 99
      expect(v.x).toBe(1)
      expect(c.x).toBe(99)
    })
  })

  describe('length', () => {
    test('unit vectors', () => {
      expect(new Vector3D(1, 0, 0).length).toBe(1)
      expect(new Vector3D(0, 1, 0).length).toBe(1)
      expect(new Vector3D(0, 0, 1).length).toBe(1)
    })

    test('3-4-5 triangle analogy', () => {
      expect(new Vector3D(3, 4, 0).length).toBe(5)
    })

    test('zero vector', () => {
      expect(new Vector3D(0, 0, 0).length).toBe(0)
    })
  })

  describe('normalize', () => {
    test('normalizes to unit length', () => {
      const v = new Vector3D(3, 4, 0)
      const prevLength = v.normalize()
      expect(prevLength).toBe(5)
      expect(v.length).toBeCloseTo(1, 10)
    })

    test('zero vector stays zero', () => {
      const v = new Vector3D(0, 0, 0)
      v.normalize()
      expect(v.length).toBe(0)
    })
  })

  describe('normalized', () => {
    test('returns new normalized vector without mutating original', () => {
      const v = new Vector3D(0, 0, 5)
      const n = v.normalized()
      expect(v.z).toBe(5)
      expect(n.z).toBeCloseTo(1, 10)
      expect(n.length).toBeCloseTo(1, 10)
    })
  })

  describe('add / added', () => {
    test('add mutates', () => {
      const a = new Vector3D(1, 2, 3)
      a.add(new Vector3D(4, 5, 6))
      expect(a.x).toBe(5)
      expect(a.y).toBe(7)
      expect(a.z).toBe(9)
    })

    test('added returns new vector', () => {
      const a = new Vector3D(1, 2, 3)
      const b = a.added(new Vector3D(10, 20, 30))
      expect(a.x).toBe(1)
      expect(b.x).toBe(11)
      expect(b.y).toBe(22)
      expect(b.z).toBe(33)
    })
  })

  describe('subtract / subtracted', () => {
    test('subtract mutates', () => {
      const a = new Vector3D(10, 20, 30)
      a.subtract(new Vector3D(1, 2, 3))
      expect(a.x).toBe(9)
      expect(a.y).toBe(18)
      expect(a.z).toBe(27)
    })

    test('subtracted returns new vector', () => {
      const a = new Vector3D(10, 20, 30)
      const b = a.subtracted(new Vector3D(1, 2, 3))
      expect(a.x).toBe(10)
      expect(b.x).toBe(9)
    })
  })

  describe('negate / negated', () => {
    test('negate mutates', () => {
      const v = new Vector3D(1, -2, 3)
      v.negate()
      expect(v.x).toBe(-1)
      expect(v.y).toBe(2)
      expect(v.z).toBe(-3)
    })

    test('negated returns new vector', () => {
      const v = new Vector3D(1, -2, 3)
      const n = v.negated()
      expect(v.x).toBe(1)
      expect(n.x).toBe(-1)
    })
  })

  describe('multiplyByScalar / multipliedByScalar', () => {
    test('multiplyByScalar mutates', () => {
      const v = new Vector3D(1, 2, 3)
      v.multiplyByScalar(2)
      expect(v.x).toBe(2)
      expect(v.y).toBe(4)
      expect(v.z).toBe(6)
    })

    test('multipliedByScalar returns new vector', () => {
      const v = new Vector3D(1, 2, 3)
      const s = v.multipliedByScalar(3)
      expect(v.x).toBe(1)
      expect(s.x).toBe(3)
      expect(s.y).toBe(6)
      expect(s.z).toBe(9)
    })
  })

  describe('dot', () => {
    test('orthogonal vectors', () => {
      expect(new Vector3D(1, 0, 0).dot(new Vector3D(0, 1, 0))).toBe(0)
    })

    test('parallel vectors', () => {
      expect(new Vector3D(2, 0, 0).dot(new Vector3D(3, 0, 0))).toBe(6)
    })

    test('general case', () => {
      expect(new Vector3D(1, 2, 3).dot(new Vector3D(4, 5, 6))).toBe(32)
    })
  })

  describe('cross', () => {
    test('x cross y = z', () => {
      const result = new Vector3D(1, 0, 0).cross(new Vector3D(0, 1, 0))
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.z).toBe(1)
    })

    test('y cross x = -z', () => {
      const result = new Vector3D(0, 1, 0).cross(new Vector3D(1, 0, 0))
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.z).toBe(-1)
    })

    test('parallel vectors give zero', () => {
      const result = new Vector3D(2, 0, 0).cross(new Vector3D(5, 0, 0))
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.z).toBe(0)
    })
  })

  describe('min/max coordinate accessors', () => {
    test('minCoordinate', () => {
      expect(new Vector3D(3, 1, 2).minCoordinate).toBe(1)
    })

    test('maxCoordinate', () => {
      expect(new Vector3D(3, 1, 2).maxCoordinate).toBe(3)
    })

    test('minAbsCoordinate', () => {
      expect(new Vector3D(-3, 1, -2).minAbsCoordinate).toBe(1)
    })

    test('maxAbsCoordinate', () => {
      expect(new Vector3D(-3, 1, -2).maxAbsCoordinate).toBe(3)
    })
  })
})
