import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';
import { CalibrationMode } from '../../types/global-settings';
import SettingsSection1VP from './settings-section-1-vp'
import SettingsSection2VP from './settings-section-2-vp'
import SettingsSectionBottom from './settings-section-bottom'

export default class SettingsPanel extends React.PureComponent<SettingsContainerProps> {
  render() {

    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let settingsSection = is1VPMode ? (<SettingsSection1VP {...this.props} />) :
                                      (<SettingsSection2VP {...this.props} />)

    return (
      <div id="left-panel" className="side-panel">
        <div id="settings-container">
          <div id="settings-top-container">
            <button onClick={() => {
              this.props.onCalibrationModeChange(CalibrationMode.OneVanishingPoint)
            }}>
              1 VP
            </button>
            <button onClick={() => {
              this.props.onCalibrationModeChange(CalibrationMode.TwoVanishingPoints)
            }}>
              2 VP
            </button>
            {settingsSection}
          </div>
          <SettingsSectionBottom { ...this.props } />
        </div>
      </div>
    )
  }



}