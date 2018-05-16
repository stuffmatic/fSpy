import * as React from 'react';
import { ReferenceDistanceUnit } from '../../types/calibration-settings';
import Dropdown from './../common/dropdown'

interface ReferenceDistanceUnitDropdownProps {
  selectedUnit: ReferenceDistanceUnit
  onChange(unit: ReferenceDistanceUnit): void
}

const options = [
  {
    value: ReferenceDistanceUnit.None,
    id: ReferenceDistanceUnit.None,
    label: ReferenceDistanceUnit.None
  },
  {
    value: ReferenceDistanceUnit.Meters,
    id: ReferenceDistanceUnit.Meters,
    label: ReferenceDistanceUnit.Meters
  },
  {
    value: ReferenceDistanceUnit.Yards,
    id: ReferenceDistanceUnit.Yards,
    label: ReferenceDistanceUnit.Yards
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
      onChange={(unit: ReferenceDistanceUnit) => {
        props.onChange(unit)
      }}
    />
  )
}