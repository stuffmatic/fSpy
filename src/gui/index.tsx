import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <div>Node version: {process.versions.node}</div>,
  document.getElementsByTagName('body')[0])
