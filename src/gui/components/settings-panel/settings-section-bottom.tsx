import React from 'react'
import { SettingsContainerProps } from '../../containers/settings-container'
import GridFloorNormalDropdown from './grid-floor-normal-dropdown'
import { Axis } from '../../types/calibration-settings'

export default class SettingsSectionBottom extends React.PureComponent<SettingsContainerProps> {
  render() {
    return (
      <div className='panel-section top-border'>
        <div className='panel-row'>
          <input
            name='imageIsDimmed'
            type='checkbox'
            checked={this.props.globalSettings.imageOpacity < 1}
            onChange={(event: any) => {
              this.props.onImageOpacityChange(event.target.checked ? 0.2 : 1)
            }}
          /> Dimmed
        </div>

        <div className='panel-row'>
          Grid floor
        </div>
        <div className='panel-row'>
          <GridFloorNormalDropdown
            selectedAxis={this.props.globalSettings.gridFloorNormal}
            onChange={(axis: Axis | null) => {
              this.props.onGridFloorNormalChange(axis)
            }}
          />
        </div>
      </div>
    )
  }
}
