import * as React from 'react';
import Transform from '../../solver/transform';

interface RotationMatrixViewProps {
  transform: Transform | null
}

export default class RotationMatrixView extends React.PureComponent<RotationMatrixViewProps> {
  render() {
    if (!this.props.transform) {
      return null
    }

    return (
      <div style={{ fontFamily:"Roboto Mono", fontSize: "12px", color: "gray" }}>
        {this.renderRow(this.props.transform.matrix[0])}
        {this.renderRow(this.props.transform.matrix[1])}
        {this.renderRow(this.props.transform.matrix[2])}
      </div>
    )
  }

  private renderRow(row: number[]) {
    let firstThree = [row[0], row[1], row[2]]
    return (
      <div style={{display: "flex"}}>
        {firstThree.map((element: number, i: number) => {
          return <span style={{width: "33%", textAlign: "left"}} key={i}>{element.toPrecision(5)}</span>
        })}
      </div>
    )
  }

}