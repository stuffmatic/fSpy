import React from 'react'
import { Axis } from '../../types/calibration-settings'
import Dropdown from './../common/dropdown'

interface ReferenceDistanceAxisDropdownProps {
  selectedAxis: Axis | null
  onChange(axis: Axis | null): void
}

const options = [
  {
    value: null,
    id: 'null',
    label: 'Default'
  },
  {
    value: Axis.PositiveX,
    id: Axis.PositiveX,
    label: 'Along the x axis'
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    label: 'Along the y axis'
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    label: 'Along the z axis'
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
      onChange={(selectedValue: Axis | null) => {
        props.onChange(selectedValue)
      }}
    />
  )
}
