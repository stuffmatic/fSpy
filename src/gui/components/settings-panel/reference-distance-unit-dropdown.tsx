import * as React from 'react'
import { ReferenceDistanceUnit } from '../../types/calibration-settings'
import Dropdown from '../common/dropdown'

interface ReferenceDistanceUnitDropdownProps {
  selectedUnit: ReferenceDistanceUnit
  onChange(unit: ReferenceDistanceUnit): void
}

const options = [
  {
    value: ReferenceDistanceUnit.None,
    id: ReferenceDistanceUnit.None,
    title: ReferenceDistanceUnit.None
  },
  {
    value: ReferenceDistanceUnit.Meters,
    id: ReferenceDistanceUnit.Meters,
    title: ReferenceDistanceUnit.Meters
  },
  {
    value: ReferenceDistanceUnit.Yards,
    id: ReferenceDistanceUnit.Yards,
    title: ReferenceDistanceUnit.Yards
  }
]

export default function ReferenceDistanceUnitDropdown(props: ReferenceDistanceUnitDropdownProps) {
  return (
    <Dropdown
      options={
        options
      }
      selectedOptionId={
        props.selectedUnit
      }
      onOptionSelected={(unit: ReferenceDistanceUnit) => {
        props.onChange(unit)
      }}
    />
  )
}
