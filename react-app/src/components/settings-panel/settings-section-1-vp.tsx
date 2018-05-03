import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';
import { PrincipalPointMode1VP, HorizonMode } from '../../types/calibration-settings';

export default class SettingsSection1VP extends React.PureComponent<SettingsContainerProps> {
  render() {

    return (
      <div className="panel-section">
        <div className="panel-row">
          Principal point
        </div>
        <div className="panel-row">
          <select
            value={this.props.calibrationSettings1VP.principalPointMode}
            onChange={(event: any) => {
              this.props.onPrincipalPointModeChange1VP(event.target.value)
            }}
          >
            <option value={PrincipalPointMode1VP.Default}>Default</option>
            <option value={PrincipalPointMode1VP.Manual}>Manual</option>
          </select>
        </div>

        <div className="panel-row">
          Horizon
        </div>
        <div className="panel-row">
          <select
            value={this.props.calibrationSettings1VP.horizonMode}
            onChange={(event: any) => {
              this.props.onHorizonModeChange(event.target.value)
            }}
          >
            <option value={HorizonMode.Default}>Default</option>
            <option value={HorizonMode.Manual}>Manual</option>
          </select>
        </div>
      </div>
    )
  }
}
