import * as React from 'react';
import { SidePanelStyle } from './../styles/styles';

interface ResultPanelProps {
  /*x:number
  y:number*/
}

export default class ResultPanelContainer extends React.Component<ResultPanelProps> {

  render() {
    return (
      <div style={ SidePanelStyle }>
        Result
      </div>
    )
  }
}