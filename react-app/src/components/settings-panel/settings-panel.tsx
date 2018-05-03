import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';
import { CalibrationMode } from '../../types/global-settings';
import SettingsSection1VP from './settings-section-1-vp'
import SettingsSection2VP from './settings-section-2-vp'
import SettingsSectionBottom from './settings-section-bottom'
import Dropdown from './dropdown'

export default class SettingsPanel extends React.PureComponent<SettingsContainerProps> {
  render() {

    let is1VPMode = this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let settingsSection = is1VPMode ? (<SettingsSection1VP {...this.props} />) :
      (<SettingsSection2VP {...this.props} />)

    return (
      <div id="left-panel" className="side-panel">
        <div id="panel-container">
          <div id="panel-top-container">
            <div className="panel-section bottom-border">
              <div className="panel-row">Number of vanishing points</div>
              <Dropdown
                options={
                  [
                    {
                      value: CalibrationMode.OneVanishingPoint,
                      id: CalibrationMode.OneVanishingPoint,
                      label: "1"
                    },
                    {
                      value: CalibrationMode.TwoVanishingPoints,
                      id: CalibrationMode.TwoVanishingPoints,
                      label: "2"
                    }
                  ]
                }
                selectedOptionId={ this.props.globalSettings.calibrationMode }
                onChange={ (selectedValue:CalibrationMode) => {
                  this.props.onCalibrationModeChange(selectedValue)
                }}
               />

            </div>
            {settingsSection}
          </div>
          <SettingsSectionBottom {...this.props} />
        </div>
      </div>
    )
  }



}