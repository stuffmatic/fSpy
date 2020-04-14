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

interface ButtonProps {
  title: string
  width?: string
  height?: string
  isSelected?: boolean
  onClick(): void
}

export default function Button(props: ButtonProps) {

  let style: any = {
    width: '135px'
  }

  if (props.width) {
    style.width = props.width
  }

  if (props.height) {
    style.height = props.height
  }

  return (
    <button style={style} onClick={() => props.onClick()}>
      {props.title}
    </button>
  )
}
