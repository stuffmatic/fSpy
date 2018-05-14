import * as React from 'react';
import ReferenceDistanceAxisDropdown from './reference-distance-axis-dropdown'
import { Axis } from '../../types/calibration-settings';

interface ReferenceDistanceFormProps {
  onReferenceAxisChange(axis: Axis | null): void
  referenceAxis:Axis | null
}

export default function ReferenceDistanceForm(props: ReferenceDistanceFormProps) {
  return (
    <div>
      <ReferenceDistanceAxisDropdown
        selectedAxis={props.referenceAxis}
        onChange={(axis: Axis | null) => {
          props.onReferenceAxisChange(axis)
        }}
      />
    </div>
  )
}