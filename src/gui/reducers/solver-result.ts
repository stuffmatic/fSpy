
import { ActionTypes } from './../actions'
import { AnyAction } from 'redux'
import { SolverResult } from '../solver/solver-result'
import { defaultSolverResult } from '../defaults/solver-result'

export function solverResult(state: SolverResult | undefined, action: AnyAction): SolverResult {
  if (state === undefined) {
    return defaultSolverResult
  }

  switch (action.type) {
    case ActionTypes.SET_SOLVER_RESULT:
      return action.result
  }

  return state
}
