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
import { existsSync, readFileSync } from 'fs'
import { setImageUrl } from './actions'

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
  let file = readFileSync(
    message.filePath
  )

  let blob = new Blob([file])
  let url = URL.createObjectURL(blob)
  let image = new Image()
  image.src = url
  image.onload = (event: Event) => {
    console.log(image.width)
    console.log(image.height)
    console.log(event)
    store.dispatch(setImageUrl(url))
  }
  image.onerror = (_: Event) => {
    alert('Failed to load the image')
  }

  console.log('got OpenImageMessage')
  console.log(message.filePath)
  console.log(url)
  console.log('exists? ' + existsSync(message.filePath))
})
