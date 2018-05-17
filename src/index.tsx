import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import 'react-select/dist/react-select.css';
import 'highlight.js/styles/atom-one-dark.css'
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import { StoreState } from './types/store-state';
import rootReducer from './reducers/root'
import { AppAction } from './actions';

const store:Store<any> = createStore<StoreState, AppAction, {}, {}>(
  rootReducer,
  //TODO: only in dev builds
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
