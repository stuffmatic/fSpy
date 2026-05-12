/// <reference types="jest" />
import * as fs from 'fs'
import * as path from 'path'

const TEST_DATA_DIR = path.resolve(__dirname, '../../../test_data')
const PROJECT_FILE_ID = 'fspy'
const PROJECT_FILE_VERSION = 1
const HEADER_SIZE = 16

interface ParsedProjectFile {
  fileId: string
  version: number
  stateSize: number
  imageSize: number
  state: Record<string, unknown>
  hasImageData: boolean
}

function parseProjectFile(buffer: Buffer): ParsedProjectFile {
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  const fileId = String.fromCharCode(buffer[0], buffer[1], buffer[2], buffer[3])
  const version = view.getUint32(4, true)
  const stateSize = view.getUint32(8, true)
  const imageSize = view.getUint32(12, true)

  const stateBytes = buffer.slice(HEADER_SIZE, HEADER_SIZE + stateSize)
  const stateString = new TextDecoder().decode(stateBytes)
  const state = JSON.parse(stateString)

  return {
    fileId,
    version,
    stateSize,
    imageSize,
    state,
    hasImageData: imageSize > 0
  }
}

function serializeProjectFile(state: Record<string, unknown>, imageData: Uint8Array | null): Uint8Array {
  const stateJsonString = JSON.stringify(state)
  const stateBytes = new TextEncoder().encode(stateJsonString)

  const headerBytes = new Uint8Array(HEADER_SIZE)
  const headerView = new DataView(headerBytes.buffer)

  headerBytes[0] = PROJECT_FILE_ID.charCodeAt(0)
  headerBytes[1] = PROJECT_FILE_ID.charCodeAt(1)
  headerBytes[2] = PROJECT_FILE_ID.charCodeAt(2)
  headerBytes[3] = PROJECT_FILE_ID.charCodeAt(3)
  headerView.setUint32(4, PROJECT_FILE_VERSION, true)
  headerView.setUint32(8, stateBytes.length, true)
  headerView.setUint32(12, imageData ? imageData.length : 0, true)

  const totalSize = HEADER_SIZE + stateBytes.length + (imageData ? imageData.length : 0)
  const fileData = new Uint8Array(totalSize)
  fileData.set(headerBytes, 0)
  fileData.set(stateBytes, HEADER_SIZE)
  if (imageData) {
    fileData.set(imageData, HEADER_SIZE + stateBytes.length)
  }

  return fileData
}

const testFiles = fs.readdirSync(TEST_DATA_DIR).filter(f => f.endsWith('.fspy'))

describe('Project file format', () => {
  describe('parse test_data files', () => {
    test.each(testFiles)('loads %s with correct header', (filename) => {
      const filePath = path.join(TEST_DATA_DIR, filename)
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      expect(parsed.fileId).toBe('fspy')
      expect(parsed.version).toBe(1)
      expect(parsed.stateSize).toBeGreaterThan(0)
      expect(buffer.length).toBe(HEADER_SIZE + parsed.stateSize + parsed.imageSize)
    })

    test.each(testFiles)('state JSON in %s is valid', (filename) => {
      const filePath = path.join(TEST_DATA_DIR, filename)
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      expect(parsed.state).toBeDefined()
      expect(typeof parsed.state).toBe('object')
    })

    test.each(testFiles)('%s has expected state shape', (filename) => {
      const filePath = path.join(TEST_DATA_DIR, filename)
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      // All project files should have these top-level keys
      expect(parsed.state).toHaveProperty('globalSettings')
      expect(parsed.state).toHaveProperty('calibrationSettingsBase')
      expect(parsed.state).toHaveProperty('controlPointsStateBase')
    })
  })

  describe('round-trip serialization', () => {
    test.each(testFiles)('round-trips %s state data', (filename) => {
      const filePath = path.join(TEST_DATA_DIR, filename)
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      // Re-serialize just the state (without image) and parse again
      const reserialized = serializeProjectFile(parsed.state, null)
      const reparsed = parseProjectFile(Buffer.from(reserialized))

      expect(reparsed.fileId).toBe('fspy')
      expect(reparsed.version).toBe(1)
      expect(reparsed.state).toEqual(parsed.state)
      expect(reparsed.imageSize).toBe(0)
    })

    test('round-trips state with image data', () => {
      const state = { test: 'data', nested: { value: 42 } }
      const imageData = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])

      const serialized = serializeProjectFile(state, imageData)
      const parsed = parseProjectFile(Buffer.from(serialized))

      expect(parsed.state).toEqual(state)
      expect(parsed.imageSize).toBe(imageData.length)
      expect(parsed.hasImageData).toBe(true)

      // Verify image bytes
      const imageStart = HEADER_SIZE + parsed.stateSize
      const imageBytes = serialized.slice(imageStart, imageStart + parsed.imageSize)
      expect(Array.from(imageBytes)).toEqual(Array.from(imageData))
    })

    test('round-trips state without image data', () => {
      const state = { empty: true }
      const serialized = serializeProjectFile(state, null)
      const parsed = parseProjectFile(Buffer.from(serialized))

      expect(parsed.state).toEqual(state)
      expect(parsed.imageSize).toBe(0)
      expect(parsed.hasImageData).toBe(false)
    })
  })

  describe('header validation', () => {
    test('header is exactly 16 bytes', () => {
      const state = { a: 1 }
      const serialized = serializeProjectFile(state, null)
      const view = new DataView(serialized.buffer, serialized.byteOffset, serialized.byteLength)

      // File ID: 'fspy'
      expect(serialized[0]).toBe(0x66) // 'f'
      expect(serialized[1]).toBe(0x73) // 's'
      expect(serialized[2]).toBe(0x70) // 'p'
      expect(serialized[3]).toBe(0x79) // 'y'

      // Version: 1 (little-endian)
      expect(view.getUint32(4, true)).toBe(1)

      // State size
      const expectedStateSize = new TextEncoder().encode(JSON.stringify(state)).length
      expect(view.getUint32(8, true)).toBe(expectedStateSize)

      // Image size: 0
      expect(view.getUint32(12, true)).toBe(0)
    })
  })

  describe('specific test file content', () => {
    test('defaults.fspy has two-vanishing-point mode', () => {
      const filePath = path.join(TEST_DATA_DIR, 'defaults.fspy')
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      const gs = parsed.state.globalSettings as Record<string, unknown>
      expect(gs.calibrationMode).toBe('TwoVanishingPoints')
    })

    test('1 vp control test.fspy has one-vanishing-point mode', () => {
      const filePath = path.join(TEST_DATA_DIR, '1 vp control test.fspy')
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      const gs = parsed.state.globalSettings as Record<string, unknown>
      expect(gs.calibrationMode).toBe('OneVanishingPoint')
    })

    test('ref_distance_in_yards.fspy has reference distance data', () => {
      const filePath = path.join(TEST_DATA_DIR, 'ref_distance_in_yards.fspy')
      const buffer = fs.readFileSync(filePath)
      const parsed = parseProjectFile(buffer)

      const csb = parsed.state.calibrationSettingsBase as Record<string, unknown>
      expect(csb).toHaveProperty('referenceDistance')
      expect(csb).toHaveProperty('referenceDistanceUnit')
    })
  })
})
