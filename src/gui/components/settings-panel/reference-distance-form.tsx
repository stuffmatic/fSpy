import * as React from 'react'
import ReferenceDistanceAxisDropdown from './reference-distance-axis-dropdown'
import ReferenceDistanceUnitDropdown from './reference-distance-unit-dropdown'
import NumericInputField from './../common/numeric-input-field'
import PanelSpacer from './../common/panel-spacer'
import { Axis, ReferenceDistanceUnit } from '../../types/calibration-settings'

interface ReferenceDistanceFormProps {
  referenceAxis: Axis | null
  referenceDistance: number
  referenceDistanceUnit: ReferenceDistanceUnit
  onReferenceAxisChange(axis: Axis | null): void
  onReferenceDistanceChange(distance: number): void
  onReferenceDistanceUnitChange(unit: ReferenceDistanceUnit): void
}

export default function ReferenceDistanceForm(props: ReferenceDistanceFormProps) {

  return (
    <div className='panelSection'>
        <ReferenceDistanceAxisDropdown
          selectedAxis={props.referenceAxis}
          onChange={(axis: Axis | null) => {
            props.onReferenceAxisChange(axis)
          }}
        />
      <PanelSpacer />

      <div style={{ display: 'flex' }}>
        <NumericInputField
          isDisabled={props.referenceAxis == null}
          valueNotAvailable={props.referenceAxis == null}
          value={props.referenceDistance}
          onSubmit={props.onReferenceDistanceChange}
        />&nbsp;
        <ReferenceDistanceUnitDropdown
          disabled={props.referenceAxis == null}
          selectedUnit={props.referenceAxis == null ? ReferenceDistanceUnit.None : props.referenceDistanceUnit}
          onChange={(unit: ReferenceDistanceUnit) => {
            props.onReferenceDistanceUnitChange(unit)
          }}
        />
      </div>
    </div>
  )
}
