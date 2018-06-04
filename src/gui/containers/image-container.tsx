import * as React from 'react'
import { StoreState } from '../types/store-state'
import { connect } from 'react-redux'
import { ImageState } from '../types/image-state'
import { Stage, Layer, Rect } from 'react-konva'
import { Palette } from '../style/palette'
import Measure, { ContentRect } from 'react-measure'

interface TestCanvasState {
  width: number | undefined
  height: number | undefined
}

class TestCanvas extends React.PureComponent<{}, TestCanvasState> {

  constructor(props: {}) {
    super(props)

    this.state = {
      width: undefined,
      height: undefined
    }
  }

  render() {
    let width = this.state.width
    let height = this.state.height

    return (
      <div id='center-panel'>
        <Measure
          client
          bounds
          offset
          onResize={(contentRect: ContentRect) => {
            let newWidth = contentRect.bounds !== undefined ? contentRect.bounds.width : undefined
            let newHeight = contentRect.bounds !== undefined ? contentRect.bounds.height : undefined
            this.setState({
              ...this.state,
              width: newWidth,
              height: newHeight
            })
          }}
        >
          {({ measureRef }) => {
            console.log('width ' + width + ', ' + height)
            return (<div id='image-panel' ref={measureRef} >
              <Stage width={width} height={height}>
                <Layer>
                  <Rect
                    x={20}
                    y={20}
                    width={width! - 2 * 20}
                    height={height! - 2 * 20}
                    fill={Palette.red}
                    shadowBlur={5}
                    onClick={(_: Event) => {
                      //
                      console.log('onClick')
                    }}
                    onDragStart={(_: Event) => {
                      //
                      console.log('onDragStart')
                    }}
                    onDragMove={(_: Event) => {
                      //
                      console.log('onDragMove')
                    }}
                    onDragEnd={(_: Event) => {
                      //
                      console.log('onDragEnd')
                    }}
                  />
                </Layer>
              </Stage>
            </div>
            )
          }
          }
        </Measure>
      </div>
    )
  }
}

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

    return (<TestCanvas />)

    /*return (
      <div id='center-panel'>
        {this.renderImagePanelOrPlaceholder()}
        <ControlPointsContainer
          top={this.state.imageTop}
          left={this.state.imageLeft}
          width={this.state.imageWidth}
          height={this.state.imageHeight}
        />
      </div>
    )*/
  }

  /*private renderImagePanelOrPlaceholder() {
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
  }*/

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
