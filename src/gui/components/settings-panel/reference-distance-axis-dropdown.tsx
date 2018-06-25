import React from 'react'
import { Axis } from '../../types/calibration-settings'
import Dropdown from '../common/dropdown'

interface ReferenceDistanceAxisDropdownProps {
  selectedAxis: Axis | null
  onChange(axis: Axis | null): void
}

const options = [
  {
    value: null,
    id: 'null',
    title: 'Default'
  },
  {
    value: Axis.PositiveX,
    id: Axis.PositiveX,
    title: 'In the x direction'
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    title: 'In the y direction'
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    title: 'In the z direction'
  }
]

export default function ReferenceDistanceAxisDropdown(props: ReferenceDistanceAxisDropdownProps) {
  return (
    <Dropdown
      options={
        options
      }
      selectedOptionId={
        props.selectedAxis ? props.selectedAxis : 'null'
      }
      onOptionSelected={(selectedValue: Axis | null) => {
        props.onChange(selectedValue)
      }}
    />
  )
}
