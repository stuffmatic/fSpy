import * as React from 'react';
import ResizableImagePanel from './../components/resizable-image-panel'
import ControlPointsContainer from './control-points-container';

interface ImageContainerState {
  imageLeft: number
  imageTop: number
  imageWidth: number
  imageHeight: number
}

export default class ImageContainer extends React.Component<{}, ImageContainerState> {

  constructor(props: {}) {
    super(props)
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
      <div style={{ backgroundColor: "#222222", position: "relative" }}>
        <ResizableImagePanel
          imageOpacity={ 0.2 }
          onResize={this.onImageResize}
          onImageLoadError={this.onImageLoadError}
        />
        <ControlPointsContainer
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