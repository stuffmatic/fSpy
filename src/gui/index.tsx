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
import { OpenProjectMessage, OpenImageMessage } from '../main/messages'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)

ipcRenderer.on(OpenProjectMessage.type, (_: any, message: OpenProjectMessage) => {
  console.log('got OpenProjectMessage')
  console.log(message.filePath)
})

ipcRenderer.on(OpenImageMessage.type, (_: any, message: OpenImageMessage) => {
  console.log('got OpenImageMessage')
  console.log(message.filePath)
})
