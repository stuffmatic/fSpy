import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';
import { PrincipalPointMode2VP } from '../../types/calibration-settings';

export default class SettingsSection1VP extends React.PureComponent<SettingsContainerProps> {
  render() {
    return (
      <div>
        <select
          value={this.props.calibrationSettings2VP.principalPointMode}
          onChange={(event: any) => {
            this.props.onPrincipalPointModeChange2VP(event.target.value)
          }}
        >
          <option value={PrincipalPointMode2VP.Default}>Default</option>
          <option value={PrincipalPointMode2VP.Manual}>Manual</option>
          <option value={PrincipalPointMode2VP.FromThirdVanishingPoint}>From 3rd vanishing point</option>
        </select>

        Quad mode: <input
          name="quadModeEnabled"
          type="checkbox"
          checked={this.props.calibrationSettings2VP.quadModeEnabled}
          onChange={(event: any) => {
            this.props.onQuadModeEnabledChange(event.target.checked)
          }}
        />
      </div>
    )
  }
}