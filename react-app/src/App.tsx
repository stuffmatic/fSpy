import * as React from 'react';
import './App.css';

const SidePanelStyle:any = {
  backgroundColor: "#f0f0f0",
  flex: "0 0 160px"
}

const ImagePanelStyle:any = {
  backgroundColor: "#333333"
}

function ControlsPanel() {
  return (
    <div style={ SidePanelStyle }>
      <h1>Controls</h1>
    </div>
  )
}

function ImagePanel() {
  return (
    <div style={ ImagePanelStyle } >
    Hello image! Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!Hello image!
    </div>
  )
}

function ResultPanel() {
  return (
    <div style={ SidePanelStyle }>
      <h1>Result</h1>
    </div>
  )
}

class App extends React.Component {
  public render() {
    return (
      <div style= { {display: "flex", height: "100vh", alignItems: "stretch"} }>
        <ControlsPanel  />
        <ImagePanel />
        <ResultPanel />
      </div>
    );
  }
}

export default App;
