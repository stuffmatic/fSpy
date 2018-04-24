import * as React from 'react';
import Measure, { ContentRect } from 'react-measure';

interface ImagePanelProps {
  onResize(imageLeft: number, imageTop: number, imageWidth: number, imageHeight: number): void
  onImageLoadError(): void
}

interface ImagePanelState {
  mostRecentContentRect: ContentRect | null
}

export default class ImagePanel extends React.Component<ImagePanelProps, ImagePanelState> {
  private imageRef: any //TODO: what type?

  constructor(props: ImagePanelProps) {
    super(props)
    this.imageRef = React.createRef()
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
    this.fireResizeCallback()
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