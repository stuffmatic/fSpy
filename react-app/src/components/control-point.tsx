import * as React from 'react';
import { Point2D } from '../types/store-state';

interface ControlPointProps {
  position:Point2D
  fill?: string
  stroke?: string
  dragCallback(position:Point2D): void
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
    this.props.dragCallback({x: e.layerX, y: e.layerY})
  };

  render() {
    return (
      <circle
        r="4"
        cx={this.props.position.x}
        cy={this.props.position.y}
        onMouseDown={this.handleMouseDown}
        fill={this.props.fill ? this.props.fill : "none"}
        stroke={this.props.stroke ? this.props.stroke : "none"}
      />
    )
  }
}