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

import React from 'react'
import { Palette } from '../../style/palette'

export enum BulletListType {
  Warnings,
  Errors
}

interface BulletListProps {
  messages: string[]
  type: BulletListType
}

export default class BulletList extends React.PureComponent<BulletListProps> {
  render() {
    return (
      <ul style={{ margin: 0, padding: 0 }}>
        {this.props.messages.map((message: string, i: number) => this.renderBullet(i, message))}
      </ul>
    )
  }

  private renderBullet(index: number, message: string) {
    return (
      <li key={index} style={{ color: Palette.disabledTextColor, display: 'flex' }}>
        {this.renderIcon()} {message}
      </li>
    )
  }

  private renderIcon() {
    let isError = this.props.type == BulletListType.Errors
    let points: number[] = []
    if (isError) {
      let r = 0.5
      for (let i = 0; i < 6; i++) {
        let angle = 2 * Math.PI * i / 6
        let x = 0.5 + r * Math.cos(angle)
        let y = 0.5 + r * Math.sin(angle)
        points.push(x)
        points.push(y)
      }
    } else {
      points = [
        0.0, 0.9,
        0.5, -0.1,
        1.0, 0.9
      ]
    }
    let color = isError ? Palette.red : Palette.orange
    let size = 12
    return (
      <div style={{ paddingRight: '4px', paddingTop: '2px' }}>
        <svg width={size} height={size}>
          <polygon points={points.map((value: number) => size * value).join(', ')} fill={color} />
          <polyline points='6, 3, 6, 7' stroke={Palette.white} />
          <polyline points='6, 8, 6, 9' stroke={Palette.white} />
        </svg>
      </div>
    )
  }
}
