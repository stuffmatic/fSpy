import { Middleware } from "redux";
import { StoreState } from "../types/store-state";
import { actionTypesTriggeringRecalculation, recalculateCalibrationResult } from "../actions";
import store from "./store";

//Middleware for requesting calibration result recalculation for
//action types matching a set of given types
export const recalculationTriggerMiddleware: Middleware<{}, StoreState> = api => next => action => {

  if (actionTypesTriggeringRecalculation.indexOf(action.type) >= 0) {
      store.dispatch<any>(recalculateCalibrationResult())
    }

  return next(action);
}