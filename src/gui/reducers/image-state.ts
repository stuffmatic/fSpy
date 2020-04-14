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
import { ImageState } from '../types/image-state'
import { defaultImageState } from '../defaults/image-state'

export function imageState(state: ImageState | undefined, action: AppAction): ImageState {
  if (state === undefined) {
    return defaultImageState
  }

  switch (action.type) {
    case ActionTypes.SET_IMAGE:
      return {
        ...state,
        data: action.data,
        url: action.url,
        width: action.width,
        height: action.height
      }
    case ActionTypes.LOAD_STATE:
      return action.imageState
    case ActionTypes.LOAD_DEFAULT_STATE:
      return {
        ...state,
        data: null,
        url: null,
        width: null,
        height: null
      }
  }

  return state
}
