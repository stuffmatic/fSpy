import * as React from 'react'
import { Stage, Layer, Rect, Circle } from 'react-konva'
import Measure, { ContentRect } from 'react-measure'
import { Palette } from '../style/palette'

interface ControlPointProps {
  xAbsolute: number
  yAbsolute: number
  onControlPointDrag(xAbsolute: number, yAbsolute: number): void
}

class ControlPoint extends React.PureComponent<ControlPointProps> {

  constructor(props: ControlPointProps) {
    super(props)
  }

  render() {
    return (
      <Circle
        draggable
        radius={10}
        fill={Palette.blue}
        x={this.props.xAbsolute}
        y={this.props.yAbsolute}
        onDragStart={(event: any) => this.handleDrag(event)}
        onDragMove={(event: any) => this.handleDrag(event)}
        onDragEnd={(event: any) => this.handleDrag(event)}
      />
    )
  }

  private handleDrag(event: any) {
    this.props.onControlPointDrag(
      event.target.x(),
      event.target.y()
    )
  }
}

interface ControlPointsContainerState {
  width: number | undefined
  height: number | undefined
}

interface ControlPointsContainerProps {

}

export default class ControlPointsContainer extends React.Component<ControlPointsContainerProps, ControlPointsContainerState> {

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
                    stroke={Palette.gray}
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
                  <ControlPoint
                    xAbsolute={20}
                    yAbsolute={20}
                    onControlPointDrag={(xAbsolute: number, yAbsolute: number) => {
                      console.log(xAbsolute + ', ' + yAbsolute)
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
