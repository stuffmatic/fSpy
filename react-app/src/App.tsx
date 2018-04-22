import * as React from 'react';
import Measure from 'react-measure';
import './App.css';

const SidePanelStyle:any = {
  backgroundColor: "#f0f0f0",
  flex: "0 0 160px"
}

const ImagePanelStyle:any = {
  backgroundColor: "#333333",
  flexGrow: 1
}

function ControlsPanel() {
  return (
    <div style={ SidePanelStyle }>
      <h1>Controls</h1>
    </div>
  )
}

class ImagePanel extends React.Component  {
  render() {
    return (
      <div style={ ImagePanelStyle }>
        <Measure
          bounds
          onResize={(contentRect) => {
            console.log(contentRect.bounds);
            this.setState({ dimensions: contentRect.bounds })
          }}
        >
          {({ measureRef }) =>
            <div ref={measureRef}>
              I can do cool things with my dimensions now :D
            </div>
        }
      </Measure>
      </div>

    )

  }

}

function ResultPanel() {
  return (
    <div style={ SidePanelStyle }>
      <h1>Result</h1>
    </div>
  )
}

class App extends React.Component {
  render() {
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
