import React from 'react'
import { Axis } from '../../types/calibration-settings'
import Dropdown from './../common/dropdown'

interface AxisDropdownProps {
  selectedAxis: Axis
  onChange(axis: Axis): void
}

const options = [
  {
    value: Axis.NegativeX,
    id: Axis.NegativeX,
    label: '-x'
  },
  {
    value: Axis.PositiveX,
    id: Axis.PositiveX,
    label: 'x'
  },
  {
    value: Axis.NegativeY,
    id: Axis.NegativeY,
    label: '-y'
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    label: 'y'
  },
  {
    value: Axis.NegativeZ,
    id: Axis.NegativeZ,
    label: '-z'
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    label: 'z'
  }
]

export default function AxisDropdown(props: AxisDropdownProps) {
  return (
    <Dropdown
      options={
        options
      }
      selectedOptionId={props.selectedAxis}
      onChange={(selectedValue: Axis) => {
        props.onChange(selectedValue)
      }}
    />
  )
}
