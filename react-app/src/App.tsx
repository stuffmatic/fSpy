import * as React from 'react';
import Measure from 'react-measure';
import './App.css';

const SidePanelStyle: any = {
  backgroundColor: "#f0f0f0",
  flex: "0 0 160px"
}

const ImagePanelStyle: any = {
  backgroundColor: "#333333",
  flexGrow: 1
}

function ControlsPanel() {
  return (
    <div style={SidePanelStyle}>
      <h1>Controls</h1>
    </div>
  )
}

class ImagePanel extends React.Component {

  imageRef: any

  constructor(props: any) {
    super(props);
    this.imageRef = React.createRef();
  }

  render() {
    return (
      <Measure
        client
        bounds
        offset
        onResize={(contentRect) => {
          let w = this.imageRef.current.naturalWidth
          let h = this.imageRef.current.naturalHeight
          console.log("resized image container to " + JSON.stringify(contentRect.bounds))
          console.log("  w " + w + ", h " + h)
        }}
      >
        {({ measureRef }) =>
          <div style={ ImagePanelStyle} ref={measureRef} >
            <img ref={this.imageRef}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Tall_Palm_in_Napier.png"
              onLoad={() => this.onImageLoad()}
              onError={() => console.log("Failed to load image...")}
            />
          </div>
        }
      </Measure>
    )
  }

  onImageLoad() {
    let w = this.imageRef.current.naturalWidth
    let h = this.imageRef.current.naturalHeight
    console.log("loaded image. w " + w + ", h " + h)
  }

}

function ResultPanel() {
  return (
    <div style={SidePanelStyle}>
      <h1>Result</h1>
    </div>
  )
}

class App extends React.Component {
  render() {
    return (
      <div style={ { display: "flex", height: "100vh", alignItems: "stretch" }}>
        <ControlsPanel />
        <ImagePanel />
        <ResultPanel />
      </div>
    );
  }
}

export default App;
