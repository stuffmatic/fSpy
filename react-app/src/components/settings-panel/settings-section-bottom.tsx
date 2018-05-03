import * as React from 'react';
import { SettingsContainerProps } from '../../containers/settings-container';

export default class SettingsSectionBottom extends React.PureComponent<SettingsContainerProps> {
  render() {
    return (
      <div>
        <div>
          Dimmed:
            <input
            name="imageIsDimmed"
            type="checkbox"
            checked={this.props.globalSettings.imageOpacity < 1}
            onChange={(event: any) => {
              this.props.onImageOpacityChange(event.target.checked ? 0.2 : 1)
            }}
          />
        </div>
        <div>

          <button onClick={() => {
            this.props.onLoadTestImage(0)
          }}>
            Load test image 1
          </button>
          <button onClick={() => {
            this.props.onLoadTestImage(1)
          }}>
            Load test image 2
          </button>
          <button onClick={() => {
            this.props.onLoadTestImage(null)
          }}>
            Load broken test image
          </button>
        </div>
      </div>
    )
  }

}