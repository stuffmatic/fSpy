import { ActionTypes } from '../actions'
import { ControlPointsState1VP } from '../types/control-points-state'
import { defaultControlPointsState1VP } from '../defaults/control-points-state'
import { AnyAction } from 'redux'

export function controlPointsState1VP(state: ControlPointsState1VP | undefined, action: AnyAction): ControlPointsState1VP {
  if (state === undefined) {
    return {
      ...defaultControlPointsState1VP
    }
  }

  switch (action.type) {
    case ActionTypes.ADJUST_HORIZON:
      let updatedHorizon = { ...state.horizon }
      updatedHorizon[action.controlPointIndex] = action.position
      return {
        ...state,
        horizon: updatedHorizon
      }
    case ActionTypes.LOAD_SAVED_STATE:
      return action.savedState.controlPointsState1VP
  }

  return state
}
