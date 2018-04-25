import { Action, DUMMY, MOVE_CONTROL_POINT } from '../actions';
import { ControlPointsState } from '../types/store-state';

export function controlPointsState(state: ControlPointsState, action: Action): ControlPointsState {
  if (state === undefined) {
    return {
      x: 0, y: 0
    }
  }

  switch (action.type) {
    case MOVE_CONTROL_POINT:
      return { ...state, x: action.x, y: action.y };
    case DUMMY:
      return { ...state };
  }
  return state;
}