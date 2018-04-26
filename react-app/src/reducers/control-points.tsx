import { AppAction, ActionTypes } from '../actions';
import { ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase, ControlPointsStates } from '../types/store-state';

const defaultControlPointsStateBase: ControlPointsStateBase = {
  principalPoint: {
    x: 0.4, y: 0.2
  },
  origin: {
    x: 0.5, y: 0.5
  },
  vanishingPointControl1: {
    vanishingLine1Start: {
      x: 0.3, y: 0.9
    },
    vanishingLine1End: {
      x: 0.35, y: 0.7
    },
    vanishingLine2Start: {
      x: 0.5, y: 0.7
    },
    vanishingLine2End: {
      x: 0.55, y: 0.8
    }
  }
}

const defaultControlPointsState1VP: ControlPointsState1VP = {
  ...defaultControlPointsStateBase,
  horizonStart: {
    x: 0.2, y: 0.5
  },
  horizonEnd: {
    x: 0.8, y: 0.5
  }
}

const defaultControlPointsState2VP: ControlPointsState2VP = {
  ...defaultControlPointsStateBase,
  vanishingPointControl2: {
    vanishingLine1Start: {
      x: 0.3, y: 0.3
    },
    vanishingLine1End: {
      x: 0.35, y: 0.1
    },
    vanishingLine2Start: {
      x: 0.5, y: 0.1
    },
    vanishingLine2End: {
      x: 0.55, y: 0.3
    }
  },
  vanishingPointControl3: {
    vanishingLine1Start: {
      x: 0.7, y: 0.9
    },
    vanishingLine1End: {
      x: 0.75, y: 0.7
    },
    vanishingLine2Start: {
      x: 0.9, y: 0.7
    },
    vanishingLine2End: {
      x: 0.95, y: 0.8
    }
  }
}

export function controlPointsStates(state: ControlPointsStates, action: AppAction): ControlPointsStates {
  if (state === undefined) {
    return {
      controlPointsState1VP: defaultControlPointsState1VP,
      controlPointsState2VP: defaultControlPointsState2VP
    }
  }

  //First, handle actions specific to a calibration mode
  switch (action.type) {
    case ActionTypes.SET_HORIZON_START:
      return {
        ...state,
        controlPointsState1VP: {
          ...state.controlPointsState1VP,
          horizonStart: action.position
        }
      }
    case ActionTypes.SET_HORIZON_END:
      return {
        ...state,
        controlPointsState1VP: {
          ...state.controlPointsState1VP,
          horizonEnd: action.position
        }
      }
  }

  //If we made it here, we could have an action that is common for all calibration modes
  switch (action.type) {
    case ActionTypes.SET_PRINCIPAL_POINT:  {
      //let stateToChange = action.calibrationMode == CalibrationMode.OneVanishingPoint ? state.controlPointsState1VP : state.controlPointsState2VP

    }
  }

  return state;

}
