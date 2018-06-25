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
