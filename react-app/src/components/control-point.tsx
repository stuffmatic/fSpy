import * as React from 'react';

interface ControlPointProps {
  x: number
  y: number
  dragCallback(x: number, y: number): void
}

export default class ControlPoint extends React.PureComponent<ControlPointProps> {

  handleMouseDown = (e: any) => { //TODO: event type
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (e: MouseEvent) => {
    this.props.dragCallback(e.layerX, e.layerY)
  };

  render() {
    return (
      <circle
        r="8"
        cx={this.props.x}
        cy={this.props.y}
        onMouseDown={this.handleMouseDown}
      />
    )
  }
}