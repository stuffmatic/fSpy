import { Middleware } from 'redux'
import { StoreState } from '../types/store-state'
import { actionTypesTriggeringRecalculation, recalculateCalibrationResult, actionTypesSettingNeedsSaveFlag, setProjectHasUnsavedChanges } from '../actions'
import store from './store'

// Middleware for requesting calibration result recalculation for
// action types matching a set of given types
export const appMiddleware: Middleware<{}, StoreState> = _ => next => action => {

  if (actionTypesTriggeringRecalculation.indexOf(action.type) >= 0) {
    store.dispatch<any>(recalculateCalibrationResult())
  }

  if (actionTypesSettingNeedsSaveFlag.indexOf(action.type) >= 0) {
    setTimeout(() => {
      store.dispatch(setProjectHasUnsavedChanges())
    })
  }

  return next(action)
}
