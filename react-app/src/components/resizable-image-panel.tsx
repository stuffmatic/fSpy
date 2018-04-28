import * as React from 'react';
import Measure, { ContentRect } from 'react-measure';

interface ResizableImagePanelProps {
  imageOpacity: number
  imageUrl: string
  onResize(imageLeft: number, imageTop: number, imageWidth: number, imageHeight: number): void
  onImageLoad(width: number, height: number): void
  onImageLoadError(): void
}

interface ResizableImagePanelState {
  mostRecentContentRect: ContentRect | null
}

export default class ResizableImagePanel extends React.Component<ResizableImagePanelProps, ResizableImagePanelState> {
  private imageRef: any //TODO: what type?

  constructor(props: ResizableImagePanelProps) {
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
              style={{ width: "100%", height: "100%", objectFit: "contain", opacity: this.props.imageOpacity }}
              src={ this.props.imageUrl }
              onLoad={() => this.onImageLoad()}
              onError={
                (e:any) => {
                  console.log(e)
                  this.props.onImageLoadError()
                }
              }
            />
          </div>
        }
      </Measure>
    )
  }

  private onImageLoad() {
    let w = this.imageRef.current.naturalWidth
    let h = this.imageRef.current.naturalHeight
    this.props.onImageLoad(w, h)
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