import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/root";
import { Store } from "react-redux";
import { StoreState } from "../types/store-state";
import { AppAction } from "../actions";
import thunk from "redux-thunk";

/*const store = createStore(rootReducer);
export default store;*/

const store:Store<any> = createStore<StoreState, AppAction, {}, {}>(
  rootReducer,
  //TODO: only in dev builds
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

export default store
