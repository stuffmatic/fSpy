import { ActionTypes, AppAction } from '../actions'
import { ImageState } from '../types/image-state'
import { defaultImageState } from '../defaults/default-image-state'

export function imageState(state: ImageState | undefined, action: AppAction): ImageState {
  if (state === undefined) {
    return defaultImageState
  }

  switch (action.type) {
    case ActionTypes.SET_IMAGE:
      return {
        ...state,
        url: action.url,
        width: action.width,
        height: action.height
      }
  }

  return state
}
