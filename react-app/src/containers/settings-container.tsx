import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';

interface SettingsContainerProps {
  /*x:number
  y:number*/
}

export default class SettingsContainer extends React.Component<SettingsContainerProps> {

  render() {
    return (
      <div style={SidePanelStyle}>
        <div>
          x <input type="number" ></input>
        </div>
        <div>
          y <input type="number" ></input>
        </div>
      </div>
    )
  }
}