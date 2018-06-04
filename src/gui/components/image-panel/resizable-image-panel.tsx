import * as React from 'react'
import Measure, { ContentRect } from 'react-measure'
import { ImageState } from '../../types/image-state'

interface ResizableImagePanelProps {
  imageOpacity: number
  image: ImageState
  onResize(imageLeft: number, imageTop: number, imageWidth: number, imageHeight: number): void
}

interface ResizableImagePanelState {
  mostRecentContentRect: ContentRect | null
}

export default class ResizableImagePanel extends React.Component<ResizableImagePanelProps, ResizableImagePanelState> {

  constructor(props: ResizableImagePanelProps) {
    super(props)
    this.state = {
      mostRecentContentRect: null
    }
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
          <div id='image-panel' ref={measureRef} >
            <img
              style={{ opacity: this.props.imageOpacity }}
              src={this.props.image.url ? this.props.image.url : ''}
            />
          </div>
        }
      </Measure>
    )
  }

  private onResize(contentRect: ContentRect) {
    this.setState({
      mostRecentContentRect: contentRect
    })
    this.fireResizeCallback()
  }

  private fireResizeCallback() {
    let contentRect = this.state.mostRecentContentRect
    if (!contentRect) {
      return
    }
    let w = this.props.image.width
    let h = this.props.image.height
    if (w && h && contentRect.bounds) {
      let boundsAspect = contentRect.bounds.width / contentRect.bounds.height
      let imageAspect = w / h
      if (imageAspect >= boundsAspect) {
        // wide image
        let scaledHeight = contentRect.bounds.width / imageAspect
        this.props.onResize(
          0,
          0.5 * (contentRect.bounds.height - scaledHeight),
          contentRect.bounds.width,
          scaledHeight
        )
      } else {
        // tall image
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
