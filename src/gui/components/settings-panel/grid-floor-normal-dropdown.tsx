import * as React from 'react'
import { Axis } from '../../types/calibration-settings'
import Dropdown from './../common/dropdown'

interface AxisDropdownProps {
  selectedAxis: Axis | null
  onChange(axis: Axis | null): void
}

const options = [
  {
    value: null,
    id: 'null',
    label: 'Off'
  },
  {
    value: Axis.PositiveX,
    id: Axis.PositiveX,
    label: 'yz plane'
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    label: 'xz plane'
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    label: 'xy plane'
  }
]

export default function GridFloorNormalDropdown(props: AxisDropdownProps) {
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
