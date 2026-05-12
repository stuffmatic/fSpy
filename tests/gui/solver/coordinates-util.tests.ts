/// <reference types="jest" />
import CoordinatesUtil, { ImageCoordinateFrame } from '../../../src/gui/solver/coordinates-util'

describe('CoordinatesUtil', () => {
  const WIDE_WIDTH = 1920
  const WIDE_HEIGHT = 1080
  const TALL_WIDTH = 1080
  const TALL_HEIGHT = 1920
  const SQUARE_SIZE = 1000

  describe('identity conversions', () => {
    test.each([
      ImageCoordinateFrame.Absolute,
      ImageCoordinateFrame.Relative,
      ImageCoordinateFrame.ImagePlane
    ])('same source and target frame returns input (%s)', (frame) => {
      const point = { x: 0.3, y: 0.7 }
      const result = CoordinatesUtil.convert(point, frame, frame, WIDE_WIDTH, WIDE_HEIGHT)
      expect(result.x).toBe(point.x)
      expect(result.y).toBe(point.y)
    })
  })

  describe('Absolute <-> Relative', () => {
    test('absolute to relative', () => {
      const result = CoordinatesUtil.convert(
        { x: 960, y: 540 },
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(result.x).toBeCloseTo(0.5, 10)
      expect(result.y).toBeCloseTo(0.5, 10)
    })

    test('relative to absolute', () => {
      const result = CoordinatesUtil.convert(
        { x: 0.5, y: 0.5 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.Absolute,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(result.x).toBeCloseTo(960, 10)
      expect(result.y).toBeCloseTo(540, 10)
    })

    test('top-left corner', () => {
      const result = CoordinatesUtil.convert(
        { x: 0, y: 0 },
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
    })

    test('bottom-right corner', () => {
      const result = CoordinatesUtil.convert(
        { x: WIDE_WIDTH, y: WIDE_HEIGHT },
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.Relative,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(result.x).toBe(1)
      expect(result.y).toBe(1)
    })
  })

  describe('Relative <-> ImagePlane (wide image)', () => {
    test('center maps to origin', () => {
      const result = CoordinatesUtil.convert(
        { x: 0.5, y: 0.5 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(result.x).toBeCloseTo(0, 10)
      expect(result.y).toBeCloseTo(0, 10)
    })

    test('top-left maps correctly for wide image', () => {
      const result = CoordinatesUtil.convert(
        { x: 0, y: 0 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      // Wide image: x in [-1, 1], y in [-1/aspect, 1/aspect]
      const aspect = WIDE_WIDTH / WIDE_HEIGHT
      expect(result.x).toBeCloseTo(-1, 10)
      expect(result.y).toBeCloseTo(1 / aspect, 10)
    })

    test('round-trip relative -> imagePlane -> relative', () => {
      const original = { x: 0.3, y: 0.7 }
      const imagePlane = CoordinatesUtil.convert(
        original,
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      const roundTripped = CoordinatesUtil.convert(
        imagePlane,
        ImageCoordinateFrame.ImagePlane,
        ImageCoordinateFrame.Relative,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(roundTripped.x).toBeCloseTo(original.x, 10)
      expect(roundTripped.y).toBeCloseTo(original.y, 10)
    })
  })

  describe('Relative <-> ImagePlane (tall image)', () => {
    test('center maps to origin', () => {
      const result = CoordinatesUtil.convert(
        { x: 0.5, y: 0.5 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        TALL_WIDTH, TALL_HEIGHT
      )
      expect(result.x).toBeCloseTo(0, 10)
      expect(result.y).toBeCloseTo(0, 10)
    })

    test('top-left maps correctly for tall image', () => {
      const result = CoordinatesUtil.convert(
        { x: 0, y: 0 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        TALL_WIDTH, TALL_HEIGHT
      )
      // Tall image: x in [-aspect, aspect], y in [-1, 1]
      const aspect = TALL_WIDTH / TALL_HEIGHT
      expect(result.x).toBeCloseTo(-aspect, 10)
      expect(result.y).toBeCloseTo(1, 10)
    })

    test('round-trip relative -> imagePlane -> relative', () => {
      const original = { x: 0.8, y: 0.2 }
      const imagePlane = CoordinatesUtil.convert(
        original,
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        TALL_WIDTH, TALL_HEIGHT
      )
      const roundTripped = CoordinatesUtil.convert(
        imagePlane,
        ImageCoordinateFrame.ImagePlane,
        ImageCoordinateFrame.Relative,
        TALL_WIDTH, TALL_HEIGHT
      )
      expect(roundTripped.x).toBeCloseTo(original.x, 10)
      expect(roundTripped.y).toBeCloseTo(original.y, 10)
    })
  })

  describe('Absolute <-> ImagePlane', () => {
    test('round-trip absolute -> imagePlane -> absolute', () => {
      const original = { x: 400, y: 300 }
      const imagePlane = CoordinatesUtil.convert(
        original,
        ImageCoordinateFrame.Absolute,
        ImageCoordinateFrame.ImagePlane,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      const roundTripped = CoordinatesUtil.convert(
        imagePlane,
        ImageCoordinateFrame.ImagePlane,
        ImageCoordinateFrame.Absolute,
        WIDE_WIDTH, WIDE_HEIGHT
      )
      expect(roundTripped.x).toBeCloseTo(original.x, 8)
      expect(roundTripped.y).toBeCloseTo(original.y, 8)
    })
  })

  describe('square image', () => {
    test('aspect ratio = 1 uses tall-image path', () => {
      // aspect <= 1, so tall path: x in [-1, 1], y in [-1, 1]
      const result = CoordinatesUtil.convert(
        { x: 0, y: 0 },
        ImageCoordinateFrame.Relative,
        ImageCoordinateFrame.ImagePlane,
        SQUARE_SIZE, SQUARE_SIZE
      )
      expect(result.x).toBeCloseTo(-1, 10)
      expect(result.y).toBeCloseTo(1, 10)
    })
  })
})
