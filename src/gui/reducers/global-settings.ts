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

import { ActionTypes, AppAction } from '../actions'
import { GlobalSettings } from './../types/global-settings'
import { defaultGlobalSettings } from './../defaults/global-settings'

export function globalSettings(state: GlobalSettings | undefined, action: AppAction): GlobalSettings {
  if (state === undefined) {
    return defaultGlobalSettings
  }

  switch (action.type) {
    case ActionTypes.SET_CALIBRATION_MODE:
      return {
        ...state,
        calibrationMode: action.calibrationMode
      }
    case ActionTypes.SET_IMAGE_OPACITY:
      return {
        ...state,
        imageOpacity: action.opacity
      }
    case ActionTypes.SET_OVERLAY_3D_GUIDE:
      return {
        ...state,
        overlay3DGuide: action.overlay3DGuide
      }
    case ActionTypes.LOAD_STATE:
      return action.savedState.globalSettings
    case ActionTypes.LOAD_DEFAULT_STATE:
      return defaultGlobalSettings
  }

  return state
}
