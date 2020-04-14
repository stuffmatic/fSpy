/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
    const diameter = 180
    const zoom = 20 * diameter / this.props.imageWith
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
          backgroundSize: 'cover',
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
