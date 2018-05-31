import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import 'react-select/dist/react-select.css';
import 'highlight.js/styles/atom-one-dark.css'
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
