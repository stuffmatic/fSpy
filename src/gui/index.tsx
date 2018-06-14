import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import store from './store/store'
import { Provider } from 'react-redux'
import './App.css'
import './index.css'
import 'react-select/dist/react-select.css'
import 'highlight.js/styles/atom-one-dark.css'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)
