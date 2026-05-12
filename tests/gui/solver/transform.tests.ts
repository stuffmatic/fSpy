/// <reference types="jest" />
import Transform from '../../../src/gui/solver/transform'
import Vector3D from '../../../src/gui/solver/vector-3d'

describe('Transform', () => {
  describe('constructor', () => {
    test('creates identity matrix', () => {
      const t = new Transform()
      expect(t.isIdentity).toBe(true)
    })
  })

  describe('fromMatrix', () => {
    test('creates transform from 4x4 array', () => {
      const t = Transform.fromMatrix([
        [1, 0, 0, 5],
        [0, 1, 0, 10],
        [0, 0, 1, 15],
        [0, 0, 0, 1]
      ])
      expect(t.matrix[0][3]).toBe(5)
      expect(t.matrix[1][3]).toBe(10)
      expect(t.matrix[2][3]).toBe(15)
    })
  })

  describe('isIdentity', () => {
    test('identity is identity', () => {
      expect(new Transform().isIdentity).toBe(true)
    })

    test('translation is not identity', () => {
      expect(Transform.translation(1, 0, 0).isIdentity).toBe(false)
    })
  })

  describe('isDiagonal', () => {
    test('identity is diagonal', () => {
      expect(new Transform().isDiagonal).toBe(true)
    })

    test('scale is diagonal', () => {
      expect(Transform.scale(2, 3, 4).isDiagonal).toBe(true)
    })

    test('rotation is not diagonal', () => {
      expect(Transform.rotation(Math.PI / 4, 0, 0, 1).isDiagonal).toBe(false)
    })
  })

  describe('translation', () => {
    test('translates a vector', () => {
      const t = Transform.translation(1, 2, 3)
      const v = t.transformedVector(new Vector3D(0, 0, 0))
      expect(v.x).toBe(1)
      expect(v.y).toBe(2)
      expect(v.z).toBe(3)
    })
  })

  describe('scale', () => {
    test('scales a vector', () => {
      const t = Transform.scale(2, 3, 4)
      const v = t.transformedVector(new Vector3D(1, 1, 1))
      expect(v.x).toBe(2)
      expect(v.y).toBe(3)
      expect(v.z).toBe(4)
    })
  })

  describe('rotation', () => {
    test('90 degree rotation around z-axis', () => {
      const t = Transform.rotation(Math.PI / 2, 0, 0, 1)
      const v = t.transformedVector(new Vector3D(1, 0, 0))
      expect(v.x).toBeCloseTo(0, 10)
      expect(v.y).toBeCloseTo(1, 10)
      expect(v.z).toBeCloseTo(0, 10)
    })

    test('360 degree rotation returns to original', () => {
      const t = Transform.rotation(2 * Math.PI, 0, 0, 1)
      const v = t.transformedVector(new Vector3D(1, 2, 3))
      expect(v.x).toBeCloseTo(1, 10)
      expect(v.y).toBeCloseTo(2, 10)
      expect(v.z).toBeCloseTo(3, 10)
    })
  })

  describe('copy', () => {
    test('returns independent copy', () => {
      const t = Transform.translation(1, 2, 3)
      const c = t.copy()
      c.translate(10, 0, 0)
      expect(t.matrix[0][3]).toBe(1)
      expect(c.matrix[0][3]).toBe(11)
    })
  })

  describe('determinant', () => {
    test('identity determinant is 1', () => {
      expect(new Transform().determinant).toBe(1)
    })

    test('scale determinant', () => {
      const t = Transform.scale(2, 3, 4)
      expect(t.determinant).toBeCloseTo(24, 10)
    })
  })

  describe('invert / inverted', () => {
    test('inverse of identity is identity', () => {
      const inv = new Transform().inverted()
      expect(inv.isIdentity).toBe(true)
    })

    test('inverse of translation', () => {
      const t = Transform.translation(1, 2, 3)
      const inv = t.inverted()
      expect(inv.matrix[0][3]).toBeCloseTo(-1, 10)
      expect(inv.matrix[1][3]).toBeCloseTo(-2, 10)
      expect(inv.matrix[2][3]).toBeCloseTo(-3, 10)
    })

    test('T * T^-1 = Identity', () => {
      const t = Transform.fromMatrix([
        [1, 2, 0, 3],
        [0, 1, 4, 0],
        [0, 0, 1, 5],
        [0, 0, 0, 1]
      ])
      const product = t.inverted().leftMultiplied(t)
      expect(product.equals(new Transform(), 1e-10)).toBe(true)
    })
  })

  describe('transpose / transposed', () => {
    test('transposing identity gives identity', () => {
      expect(new Transform().transposed().isIdentity).toBe(true)
    })

    test('double transpose gives original', () => {
      const t = Transform.fromMatrix([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ])
      const doubleT = t.transposed().transposed()
      expect(doubleT.equals(t)).toBe(true)
    })
  })

  describe('concatenate', () => {
    test('concatenating with identity gives same transform', () => {
      const t = Transform.translation(1, 2, 3)
      const result = Transform.concatenate([t, new Transform()])
      expect(result.equals(t, 1e-10)).toBe(true)
    })

    test('translate then scale', () => {
      const t = Transform.translation(1, 0, 0)
      const s = Transform.scale(2, 2, 2)
      // s * t: first translate, then scale => (1*2, 0, 0) with translation scaled
      const result = Transform.concatenate([s, t])
      const v = result.transformedVector(new Vector3D(0, 0, 0))
      expect(v.x).toBeCloseTo(2, 10)
    })
  })

  describe('transformVector / transformedVector', () => {
    test('transformVector mutates input', () => {
      const t = Transform.translation(10, 20, 30)
      const v = new Vector3D(1, 2, 3)
      t.transformVector(v)
      expect(v.x).toBe(11)
      expect(v.y).toBe(22)
      expect(v.z).toBe(33)
    })

    test('transformedVector does not mutate input', () => {
      const t = Transform.translation(10, 20, 30)
      const v = new Vector3D(1, 2, 3)
      const result = t.transformedVector(v)
      expect(v.x).toBe(1)
      expect(result.x).toBe(11)
    })
  })

  describe('transform2DPoint', () => {
    test('translates 2D point', () => {
      const t = Transform.translation(5, 10)
      const p = { x: 1, y: 2 }
      t.transform2DPoint(p)
      expect(p.x).toBe(6)
      expect(p.y).toBe(12)
    })
  })

  describe('equals', () => {
    test('same transforms are equal', () => {
      const a = Transform.translation(1, 2, 3)
      const b = Transform.translation(1, 2, 3)
      expect(a.equals(b)).toBe(true)
    })

    test('different transforms are not equal', () => {
      const a = Transform.translation(1, 2, 3)
      const b = Transform.translation(4, 5, 6)
      expect(a.equals(b)).toBe(false)
    })

    test('approximate equality with epsilon', () => {
      const a = Transform.translation(1, 2, 3)
      const b = Transform.translation(1.0001, 2.0001, 3.0001)
      expect(a.equals(b, 0.001)).toBe(true)
      expect(a.equals(b, 0.00001)).toBe(false)
    })
  })
})
