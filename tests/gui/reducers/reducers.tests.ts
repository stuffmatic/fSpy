/// <reference types="jest" />
import { globalSettings } from '../../../src/gui/reducers/global-settings'
import { imageState } from '../../../src/gui/reducers/image-state'
import { resultDisplaySettings } from '../../../src/gui/reducers/result-display-settings'
import { defaultGlobalSettings } from '../../../src/gui/defaults/global-settings'
import { defaultImageState } from '../../../src/gui/defaults/image-state'
import { defaultResultDisplaySettings } from '../../../src/gui/defaults/result-display-settings'
import { CalibrationMode, Overlay3DGuide } from '../../../src/gui/types/global-settings'
import { OrientationFormat, PrincipalPointFormat, FieldOfViewFormat } from '../../../src/gui/types/result-display-settings'
import { ActionTypes } from '../../../src/gui/actions'

describe('globalSettings reducer', () => {
  test('returns default state when undefined', () => {
    const state = globalSettings(undefined, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state).toEqual(defaultGlobalSettings)
  })

  test('returns default state on LOAD_DEFAULT_STATE', () => {
    const modified = {
      ...defaultGlobalSettings,
      imageOpacity: 0.99
    }
    const state = globalSettings(modified, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state).toEqual(defaultGlobalSettings)
  })

  test('SET_CALIBRATION_MODE', () => {
    const state = globalSettings(defaultGlobalSettings, {
      type: ActionTypes.SET_CALIBRATION_MODE,
      calibrationMode: CalibrationMode.OneVanishingPoint
    })
    expect(state.calibrationMode).toBe(CalibrationMode.OneVanishingPoint)
    // Other fields unchanged
    expect(state.imageOpacity).toBe(defaultGlobalSettings.imageOpacity)
    expect(state.overlay3DGuide).toBe(defaultGlobalSettings.overlay3DGuide)
  })

  test('SET_IMAGE_OPACITY', () => {
    const state = globalSettings(defaultGlobalSettings, {
      type: ActionTypes.SET_IMAGE_OPACITY,
      opacity: 0.75
    })
    expect(state.imageOpacity).toBe(0.75)
    expect(state.calibrationMode).toBe(defaultGlobalSettings.calibrationMode)
  })

  test('SET_OVERLAY_3D_GUIDE', () => {
    const state = globalSettings(defaultGlobalSettings, {
      type: ActionTypes.SET_OVERLAY_3D_GUIDE,
      overlay3DGuide: Overlay3DGuide.Box
    })
    expect(state.overlay3DGuide).toBe(Overlay3DGuide.Box)
  })

  test('unknown action returns current state', () => {
    const state = globalSettings(defaultGlobalSettings, { type: 'UNKNOWN_ACTION' } as any)
    expect(state).toBe(defaultGlobalSettings)
  })
})

describe('imageState reducer', () => {
  test('returns default state when undefined', () => {
    const state = imageState(undefined, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state).toEqual(defaultImageState)
  })

  test('SET_IMAGE', () => {
    const data = new Uint8Array([1, 2, 3])
    const state = imageState(defaultImageState, {
      type: ActionTypes.SET_IMAGE,
      url: 'test.png',
      data: data,
      width: 800,
      height: 600
    })
    expect(state.url).toBe('test.png')
    expect(state.data).toBe(data)
    expect(state.width).toBe(800)
    expect(state.height).toBe(600)
  })

  test('LOAD_DEFAULT_STATE clears image data', () => {
    const withImage = {
      width: 800,
      height: 600,
      url: 'test.png',
      data: new Uint8Array([1, 2, 3])
    }
    const state = imageState(withImage, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state.width).toBeNull()
    expect(state.height).toBeNull()
    expect(state.url).toBeNull()
    expect(state.data).toBeNull()
  })

  test('unknown action returns current state', () => {
    const current = { width: 100, height: 200, url: 'x', data: null }
    const state = imageState(current, { type: 'UNKNOWN' } as any)
    expect(state).toBe(current)
  })
})

describe('resultDisplaySettings reducer', () => {
  test('returns default state when undefined', () => {
    const state = resultDisplaySettings(undefined, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state).toEqual(defaultResultDisplaySettings)
  })

  test('SET_FOV_DISPLAY_FORMAT', () => {
    const state = resultDisplaySettings(defaultResultDisplaySettings, {
      type: ActionTypes.SET_FOV_DISPLAY_FORMAT,
      displayFormat: FieldOfViewFormat.Radians
    })
    expect(state.fieldOfViewFormat).toBe(FieldOfViewFormat.Radians)
    expect(state.orientationFormat).toBe(defaultResultDisplaySettings.orientationFormat)
  })

  test('SET_ORIENTATION_DISPLAY_FORMAT', () => {
    const state = resultDisplaySettings(defaultResultDisplaySettings, {
      type: ActionTypes.SET_ORIENTATION_DISPLAY_FORMAT,
      displayFormat: OrientationFormat.Quaterion
    })
    expect(state.orientationFormat).toBe(OrientationFormat.Quaterion)
  })

  test('SET_PRINCIPAL_POINT_DISPLAY_FORMAT', () => {
    const state = resultDisplaySettings(defaultResultDisplaySettings, {
      type: ActionTypes.SET_PRINCIPAL_POINT_DISPLAY_FORMAT,
      displayFormat: PrincipalPointFormat.Relative
    })
    expect(state.principalPointFormat).toBe(PrincipalPointFormat.Relative)
  })

  test('SET_DISPLAY_ABSOLUTE_FOCAL_LENGTH', () => {
    const state = resultDisplaySettings(defaultResultDisplaySettings, {
      type: ActionTypes.SET_DISPLAY_ABSOLUTE_FOCAL_LENGTH,
      displayAbsoluteFocalLength: true
    })
    expect(state.displayAbsoluteFocalLength).toBe(true)
  })

  test('LOAD_DEFAULT_STATE resets to defaults', () => {
    const modified = {
      ...defaultResultDisplaySettings,
      fieldOfViewFormat: FieldOfViewFormat.Radians,
      displayAbsoluteFocalLength: true
    }
    const state = resultDisplaySettings(modified, { type: ActionTypes.LOAD_DEFAULT_STATE })
    expect(state).toEqual(defaultResultDisplaySettings)
  })

  test('unknown action returns current state', () => {
    const state = resultDisplaySettings(defaultResultDisplaySettings, { type: 'UNKNOWN' } as any)
    expect(state).toBe(defaultResultDisplaySettings)
  })
})
