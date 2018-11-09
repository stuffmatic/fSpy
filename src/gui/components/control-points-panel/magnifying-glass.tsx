import * as React from 'react'
import Point2D from '../../solver/point-2d'

interface MagnifyingGlassProps {
  position: Point2D
  relativeImagePosition: Point2D
  imageWith: number
  imageHeight: number
  imageSrc: string | null
}

export default class MagnifyingGlass extends React.PureComponent<MagnifyingGlassProps> {
  render() {
    const zoom = 1
    const diameter = 180
    if (!this.props.imageSrc) {
      return null
    }
    const xGlass = (this.props.position.x - diameter / 2)
    const yGlass = (this.props.position.y - diameter / 2)
    const xBg = -zoom * this.props.imageWith * this.props.relativeImagePosition.x + 0.5 * diameter
    const yBg = -zoom * this.props.imageHeight * this.props.relativeImagePosition.y + 0.5 * diameter
    const crossSize = 24
    return (
      <div
        style={{
          willChange: 'transform',
          width: diameter + 'px',
          height: diameter + 'px',
          position: 'absolute',
          overflow: 'hidden',
          border: '1px solid #202020',
          borderRadius: '50%',
          transform: 'translate(' + xGlass + 'px, ' + yGlass + 'px)'
        }}>
        <div style={{
          willChange: 'transform',
          backgroundColor: '#ff0000',
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'url(' + this.props.imageSrc + ')',
          width: zoom * this.props.imageWith + 'px',
          height: zoom * this.props.imageHeight + 'px',
          transform: 'translate(' + xBg + 'px, ' + yBg + 'px)'
        }}>
        </div>
        <div style={{
          width: crossSize,
          height: 1,
          backgroundColor: 'white',
          position: 'absolute',
          top: diameter / 2,
          left: diameter / 2 - crossSize / 2
        }} ></div>
        <div style={{
          width: 1,
          height: crossSize,
          backgroundColor: 'white',
          position: 'absolute',
          top: diameter / 2 - crossSize / 2,
          left: diameter / 2
        }} ></div>
      </div>
    )
  }
}
