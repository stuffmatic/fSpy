import { AppAction, SET_HORIZON_START, SET_HORIZON_END } from '../actions';
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase, ControlPointsStates } from '../types/store-state';

const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.4, y: 0.2
  },
  origin: {
    x: 0.5, y: 0.5
  }
}

const defaultControlPointsState1VP: ControlPointsState1VP = {
  ...defaultControlPointsStateBase,
  horizonStart:  {
    x: 0.2, y: 0.5
  },
  horizonEnd:  {
    x: 0.8, y: 0.5
  }
}

const defaultControlPointsState2VP: ControlPointsState2VP = {
  ...defaultControlPointsStateBase
}

export function controlPointsStates(state: ControlPointsStates, action: AppAction): ControlPointsStates {
  if (state === undefined) {
    return {
      controlPointsState1VP: defaultControlPointsState1VP,
      controlPointsState2VP: defaultControlPointsState2VP
    }
  }

  switch (action.type) {
    case SET_HORIZON_START:
      return {
        ...state,
        controlPointsState1VP: {
          ...state.controlPointsState1VP,
          horizonStart: action.position
        }
      }
    case SET_HORIZON_END:
      return {
        ...state,
        controlPointsState1VP: {
          ...state.controlPointsState1VP,
          horizonEnd: action.position
        }
      }
  }

  return state;

}
