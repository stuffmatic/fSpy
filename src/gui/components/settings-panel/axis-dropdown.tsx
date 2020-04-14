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
import { Axis } from '../../types/calibration-settings'
import Dropdown from '../common/dropdown'
import { Palette } from '../../style/palette'

interface AxisDropdownProps {
  selectedAxis: Axis
  onChange(axis: Axis): void
}

const options = [
  {
    value: Axis.NegativeX,
    id: Axis.NegativeX,
    title: '-x',
    circleColor: Palette.red
  },
  {
    value: Axis.PositiveX,
    id: Axis.PositiveX,
    title: 'x',
    circleColor: Palette.red
  },
  {
    value: Axis.NegativeY,
    id: Axis.NegativeY,
    title: '-y',
    circleColor: Palette.green
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    title: 'y',
    circleColor: Palette.green
  },
  {
    value: Axis.NegativeZ,
    id: Axis.NegativeZ,
    title: '-z',
    circleColor: Palette.blue
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    title: 'z',
    circleColor: Palette.blue
  }
]

export default function AxisDropdown(props: AxisDropdownProps) {
  return (
    <Dropdown
      options={
        options
      }
      selectedOptionId={props.selectedAxis}
      onOptionSelected={(selectedValue: Axis) => {
        props.onChange(selectedValue)
      }}
    />
  )
}
