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
import { OpenProjectMessage, OpenImageMessage, SaveProjectMessage, SaveProjectAsMessage, NewProjectMessage } from '../main/ipc-messages'
import { readFileSync } from 'fs'
import { setImage } from './actions'
import { SpecifyProjectPathMessage } from './ipc-messages'
import ProjectFile from './io/project-file'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)

ipcRenderer.on(NewProjectMessage.type, (_: any, message: NewProjectMessage) => {
  console.log(message)
})

ipcRenderer.on(OpenProjectMessage.type, (_: any, message: OpenProjectMessage) => {
  console.log(message.filePath)
})

ipcRenderer.on(SaveProjectMessage.type, (_: any, message: SaveProjectMessage) => {
  console.log('Got SaveProjectMessage ' + message)

  let hasProjectPath = false
  if (hasProjectPath) {
    ProjectFile.save('/Users/perarne/code/f-spy/app/test_data')
  } else {
    ipcRenderer.send(SpecifyProjectPathMessage.type, new SpecifyProjectPathMessage())
  }
})

ipcRenderer.on(SaveProjectAsMessage.type, (_: any, message: SaveProjectAsMessage) => {
  console.log('Got SaveProjectAsMessage, path ' + message.filePath)
})

ipcRenderer.on(OpenImageMessage.type, (_: any, message: OpenImageMessage) => {
  let file = readFileSync(
    message.filePath
  )

  let blob = new Blob([file])
  let url = URL.createObjectURL(blob)
  let image = new Image()
  image.src = url
  image.onload = (_: Event) => {
    store.dispatch(setImage(url, image.width, image.height))
  }
  image.onerror = (_: Event) => {
    alert('Failed to load the image')
  }
})
