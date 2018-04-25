import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';

interface SettingsPanelProps {
  /*x:number
  y:number*/
}

export default class SettingsPanelContainer extends React.Component<SettingsPanelProps> {

  render() {
    return (
      <div style={ SidePanelStyle }>
        Settings
      </div>
    )
  }
}