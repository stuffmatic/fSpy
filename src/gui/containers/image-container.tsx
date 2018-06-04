import * as React from 'react'
import ResizableImagePanel from './../components/image-panel/resizable-image-panel'
import ControlPointsContainer from './control-points-container'
import { StoreState } from '../types/store-state'
import { connect } from 'react-redux'
import { ImageState } from '../types/image-state'

interface ImageContainerProps {
  imageOpacity: number
  imageState: ImageState
}

interface ImageContainerState {
  imageLeft: number
  imageTop: number
  imageWidth: number
  imageHeight: number
}

class ImageContainer extends React.Component<ImageContainerProps, ImageContainerState> {
  constructor(props: ImageContainerProps) {
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
      <div id='center-panel'>
        {this.renderImagePanelOrPlaceholder()}
        <ControlPointsContainer
          top={this.state.imageTop}
          left={this.state.imageLeft}
          width={this.state.imageWidth}
          height={this.state.imageHeight}
        />
      </div>
    )
  }

  private renderImagePanelOrPlaceholder() {
    if (this.props.imageState.url) {
      return (
        <ResizableImagePanel
          imageOpacity={this.props.imageOpacity}
          image={this.props.imageState}
          onResize={this.onImageResize}
        />
      )
    }

    return (
      <div >
        Load an image vetja!
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
}

export function mapStateToProps(state: StoreState) {
  return {
    imageOpacity: state.globalSettings.imageOpacity,
    imageState: state.image
  }
}

export default connect(mapStateToProps, null)(ImageContainer)
