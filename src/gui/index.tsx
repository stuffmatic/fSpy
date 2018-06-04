import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import store from './store/store'
import { Provider } from 'react-redux'

import './App.css'
import './index.css'
import 'react-select/dist/react-select.css'
import 'highlight.js/styles/atom-one-dark.css'
import { ipcRenderer } from 'electron'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)

ipcRenderer.on('test-message', (event: any, args: any) => {
  console.log('got test message in renderer process!')
  console.log('event')
  console.log(event)
  console.log('args')
  console.log(args)
})
