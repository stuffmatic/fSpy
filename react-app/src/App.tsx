import * as React from 'react';
import Measure, { ContentRect } from 'react-measure';
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

interface ImagePanelProps {
  onResize(imageLeft: number, imageTop: number, imageWidth: number, imageHeight: number): void
  onImageLoadError(): void
}

class ImagePanel extends React.Component<ImagePanelProps> {
  private imageRef: any //TODO: what type?

  constructor(props: ImagePanelProps) {
    super(props)
    this.imageRef = React.createRef()
  }

  render() {
    return (
      <Measure
        client
        bounds
        offset
        onResize={(contentRect) => {
          this.onResize(contentRect)
        }}
      >
        {({ measureRef }) =>
          <div style={{ height: "100vh", flexGrow: 1 }} ref={measureRef} >
            <img ref={this.imageRef}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src="https://upload.wikimedia.org/wikipedia/commons/f/f8/Tall_Palm_in_Napier.png"
              onLoad={() => this.onImageLoad()}
              onError={() => this.props.onImageLoadError()}
            />
          </div>
        }
      </Measure>
    )
  }

  private onImageLoad() {
    //this.props.onResize()
  }

  private onResize(contentRect: ContentRect) {
    let w = this.imageRef.current.naturalWidth
    let h = this.imageRef.current.naturalHeight
    if (w && h && contentRect.bounds) {
      let boundsAspect = contentRect.bounds.width / contentRect.bounds.height
      let imageAspect = w / h
      if (imageAspect >= boundsAspect) {
        //wide image
        let scaledHeight = contentRect.bounds.width / imageAspect
        this.props.onResize(
          0,
          0.5 * (contentRect.bounds.height - scaledHeight),
          contentRect.bounds.width,
          scaledHeight
        )
      }
      else {
        //tall image
        let scaledWidth = contentRect.bounds.height * imageAspect
        this.props.onResize(
          0.5 * (contentRect.bounds.width - scaledWidth),
          0,
          scaledWidth,
          contentRect.bounds.height
        )
      }
    }
  }
}


interface ImageContainerState {
  imageLeft: number
  imageTop: number
  imageWidth: number
  imageHeight: number
}

class ImageContainer extends React.Component<any, ImageContainerState> {

  constructor() {
    super({})
    this.state = {
      imageLeft: 0,
      imageTop: 0,
      imageWidth: 0,
      imageHeight: 0
    }

    this.onImageResize = this.onImageResize.bind(this)
  }

  render() {
    return (
      <div style={{ ...ImagePanelStyle, position: "relative" }}>
        <ImagePanel
          onResize={this.onImageResize}
          onImageLoadError={this.onImageLoadError}
        />
        <ControlPointsPanel
          top={this.state.imageTop}
          left={this.state.imageLeft}
          width={this.state.imageWidth}
          height={this.state.imageHeight}
        />
      </div>
    )
  }

  private onImageResize(
    imageLeft: number,
    imageTop: number,
    imageWidth: number,
    imageHeight: number
  ) {
    console.log(this)
    if (!this.state) {
      return
    }
    this.setState({
      imageLeft: imageLeft,
      imageTop: imageTop,
      imageWidth: imageWidth,
      imageHeight: imageHeight
    })
  }

  private onImageLoadError() {

  }
}

function ResultPanel() {
  return (
    <div style={SidePanelStyle}>
      <h1>Result</h1>
    </div>
  )
}

interface ControlPointsPanelProps {
  left: number
  top: number
  width: number
  height: number
}

class ControlPointsPanel extends React.Component<ControlPointsPanelProps> {

  constructor(props: ControlPointsPanelProps) {
    super(props)
  }

  render() {
    return (
      <svg style={
        {
          top: this.props.top,
          left: this.props.left,
          width: this.props.width,
          height: this.props.height,
          position: "absolute",
          backgroundColor: "red",
          opacity: 0.4
        }
      }
      >
        <circle r="10" cx="100" cy="100" />
      </svg>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div style={ { display: "flex", height: "100vh", alignItems: "stretch" }}>
        <ControlsPanel />
        <ImageContainer />
        <ResultPanel />
      </div>
    );
  }
}

export default App;
