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

export default class ReferenceDistanceForm extends React.PureComponent<ReferenceDistanceFormProps> {

  render() {
    return (
      <div className='panelSection'>
          <ReferenceDistanceAxisDropdown
            selectedAxis={this.props.referenceAxis}
            onChange={(axis: Axis | null) => {
              this.props.onReferenceAxisChange(axis)
            }}
          />
          { this.renderDistanceInputField() }
      </div>
    )
  }

  private renderDistanceInputField() {
    if (this.props.referenceAxis == null) {
      return null
    }

    return (
      <div>
      <PanelSpacer />
        <div style={{ display: 'flex' }}>
          <NumericInputField
            isDisabled={this.props.referenceAxis == null}
            valueNotAvailable={this.props.referenceAxis == null}
            value={this.props.referenceDistance}
            onSubmit={this.props.onReferenceDistanceChange}
          />
          <span style={{ marginLeft: '8px', width: '100%' }}><ReferenceDistanceUnitDropdown
            disabled={this.props.referenceAxis == null}
            selectedUnit={this.props.referenceAxis == null ? ReferenceDistanceUnit.None : this.props.referenceDistanceUnit}
            onChange={(unit: ReferenceDistanceUnit) => {
              this.props.onReferenceDistanceUnitChange(unit)
            }}
          /></span>
        </div>
      </div>
    )
  }

}
