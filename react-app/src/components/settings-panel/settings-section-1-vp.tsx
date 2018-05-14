import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';
import { PrincipalPointMode1VP, HorizonMode, Axis } from '../../types/calibration-settings';
import AxisDropdown from './axis-dropdown'
import PanelSpacer from './../common/panel-spacer'
import Dropdown from './../common/dropdown'
import ReferenceDistanceForm from './reference-distance-form'
import SensorSizeForm from './../common/sensor-size-form'
import NumericInputField from './../common/numeric-input-field'
import AbsoluteFocalLengthForm from './../common/absolute-focal-length-form'

export default class SettingsSection1VP extends React.PureComponent<SettingsContainerProps> {
  render() {

    return (
      <div className="panel-section">
        <div className="panel-row">
          <NumericInputField value={1318} onSubmit={(value: number) => { }} />
        </div>
        <div className="panel-row">
          Principal point
        </div>
        <div className="panel-row">
          <Dropdown
            options={
              [
                {
                  value: PrincipalPointMode1VP.Default,
                  id: PrincipalPointMode1VP.Default,
                  label: "Image midpoint"
                },
                {
                  value: PrincipalPointMode1VP.Manual,
                  id: PrincipalPointMode1VP.Manual,
                  label: PrincipalPointMode1VP.Manual
                }
              ]
            }
            selectedOptionId={this.props.calibrationSettings1VP.principalPointMode}
            onChange={(selectedValue: PrincipalPointMode1VP) => {
              this.props.onPrincipalPointModeChange1VP(selectedValue)
            }}
          />
        </div>
        <PanelSpacer />
        <div className="panel-row">
          Vanishing point axis
        </div>
        <div className="panel-row">
          <AxisDropdown
            selectedAxis={this.props.calibrationSettings1VP.vanishingPointAxis}
            onChange={(axis: Axis) =>  {
              this.props.onVanishingPointAxisChange1VP(axis)
            }
            }
          />
        </div>

        <PanelSpacer />
        <div className="panel-row">
          Reference distance
        </div>
        <div className="panel-row">
        <ReferenceDistanceForm
            referenceAxis={this.props.calibrationSettings1VP.referenceDistanceAxis}
            onReferenceAxisChange={(axis:Axis | null) => {
              this.props.onReferenceDistanceAxisChange1VP(axis)
            }}
          />
        </div>

        <PanelSpacer />
        <div className="panel-row">
          Camera data
        </div>
        <div className="panel-row">
          <AbsoluteFocalLengthForm />
        </div>
        <div className="panel-row">
          <SensorSizeForm />
        </div>

        <PanelSpacer />
        <div className="panel-row">
          Up axis
        </div>
        <div className="panel-row">
          <AxisDropdown
            selectedAxis={Axis.PositiveZ}
            onChange={
              (axis: Axis) => console.log("selected axis " + axis)
            }
          />
        </div>
        <PanelSpacer />
        <div className="panel-row">
          Horizon
        </div>
        <div className="panel-row">
          <Dropdown
            options={
              [
                {
                  value: HorizonMode.Default,
                  id: HorizonMode.Default,
                  label: "Flat"
                },
                {
                  value: HorizonMode.Manual,
                  id: HorizonMode.Manual,
                  label: HorizonMode.Manual
                }
              ]
            }
            selectedOptionId={this.props.calibrationSettings1VP.horizonMode}
            onChange={(selectedValue: HorizonMode) => {
              this.props.onHorizonModeChange(selectedValue)
            }}
          />
        </div>
      </div>
    )
  }
}
