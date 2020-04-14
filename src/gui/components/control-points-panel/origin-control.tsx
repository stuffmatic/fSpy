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
import ControlPoint from './control-point'
import Point2D from '../../solver/point-2d'

interface OriginControlProps {
  absolutePosition: Point2D
  dragCallback(position: Point2D): void
}

export default function OriginControl(props: OriginControlProps) {
  return (
    <ControlPoint
      absolutePosition={props.absolutePosition}
      onControlPointDrag={props.dragCallback}
      fill='white'
    />
  )
}
