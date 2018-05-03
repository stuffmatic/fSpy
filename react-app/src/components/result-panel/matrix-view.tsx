import * as React from 'react';
import Transform from '../../solver/transform';

interface MatrixViewProps {
  transform: Transform | null
}

export default class MatrixView extends React.PureComponent<MatrixViewProps> {
  render() {
    if (!this.props.transform) {
      return null
    }

    return (
      <div style={{ fontFamily:"Roboto Mono", fontSize: "10px", color: "gray" }}>
        {this.renderRow(this.props.transform.matrix[0])}
        {this.renderRow(this.props.transform.matrix[1])}
        {this.renderRow(this.props.transform.matrix[2])}
        {this.renderRow(this.props.transform.matrix[3])}
      </div>
    )
  }

  private renderRow(row: number[]) {
    return (
      <div style={{display: "flex"}}>
        {row.map((element: number, i: number) => <span style={{width: "25%", textAlign: "right"}} key={i}>{element.toPrecision(5)}</span>)}
      </div>
    )

  }

}