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
import { Overlay3DGuide } from '../../types/global-settings'
import Dropdown from '../common/dropdown'

interface Overlay3DGuideDropdownProps {
  overlay3DGuide: Overlay3DGuide
  onChange(overlay3DGuide: Overlay3DGuide): void
}

const options = [
  {
    value: Overlay3DGuide.None,
    id: Overlay3DGuide.None,
    title: 'Off'
  },
  {
    value: Overlay3DGuide.Box,
    id: Overlay3DGuide.Box,
    title: 'Box'
  },
  {
    value: Overlay3DGuide.YZGridFloor,
    id: Overlay3DGuide.YZGridFloor,
    title: 'yz grid floor'
  },
  {
    value: Overlay3DGuide.ZXGridFloor,
    id: Overlay3DGuide.ZXGridFloor,
    title: 'xz grid floor'
  },
  {
    value: Overlay3DGuide.XYGridFloor,
    id: Overlay3DGuide.XYGridFloor,
    title: 'xy grid floor'
  }
]

export default function Overlay3DGuideDropdown(props: Overlay3DGuideDropdownProps) {
  return (
    <Dropdown
      options={options}
      selectedOptionId={props.overlay3DGuide}
      onOptionSelected={props.onChange}
    />
  )
}
