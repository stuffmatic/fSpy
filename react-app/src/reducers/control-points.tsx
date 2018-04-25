import { AppAction, SET_PRINCIPAL_POINT } from '../actions';
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase } from '../types/store-state';

const defaultControlPointsStateBase:ControlPointsStateBase = {
  principalPoint: {
    x: 0.4, y: 0.2
  },
  origin: {
    x: 0.5, y: 0.5
  }
}

const defaultControlPointsState1VP:ControlPointsState1VP = {
  ...defaultControlPointsStateBase,
  horizonStart: {
    x: 0.2, y: 0.5
  },
  horizonEnd: {
    x: 0.8, y: 0.5
  }
}

const defaultControlPointsState2VP:ControlPointsState2VP = {
  ...defaultControlPointsStateBase
}

export function controlPointsState1VP(state: ControlPointsState1VP, action: AppAction): ControlPointsState1VP {
  if (state === undefined) {
    return defaultControlPointsState1VP
  }

  switch (action.type) {
    case SET_PRINCIPAL_POINT:
      return {
        ...state,
        principalPoint: action.position
      }
  }
  return state;
}

export function controlPointsState2VP(state: ControlPointsState2VP, action: AppAction): ControlPointsState2VP {
  if (state === undefined) {
    return defaultControlPointsState2VP
  }

  switch (action.type) {
    case SET_PRINCIPAL_POINT:
    return {
      ...state,
      principalPoint: action.position
    }
  }
  return state;
}