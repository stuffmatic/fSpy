import React from 'react'
import { Axis } from '../../types/calibration-settings'
import Dropdown from '../common/dropdown'
import { Palette } from '../../style/palette'
import Constants from '../../constants'

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
    title: Constants.referenceDistanceAnchorEnabled ? 'In the x direction' : 'Along the x axis',
    circleColor: Palette.red
  },
  {
    value: Axis.PositiveY,
    id: Axis.PositiveY,
    title: Constants.referenceDistanceAnchorEnabled ? 'In the y direction' : 'Along the y axis',
    circleColor: Palette.green
  },
  {
    value: Axis.PositiveZ,
    id: Axis.PositiveZ,
    title: Constants.referenceDistanceAnchorEnabled ? 'In the z direction' : 'Along the z axis',
    circleColor: Palette.blue
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
