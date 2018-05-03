import * as React from 'react';

interface Overlay3DPanelProps {
  width:number
  height:number
}

export default class Overlay3DPanel extends React.PureComponent<Overlay3DPanelProps> {
  render() {
    return (
      <g>
        <circle cx={0.5 * this.props.width} cy={0.5 * this.props.height} r={0.2 * this.props.width} fill="green"/>
      </g>
    )
  }

}