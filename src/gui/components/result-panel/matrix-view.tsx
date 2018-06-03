import React from 'react'

interface RotationMatrixViewProps {
  rows: number[][] | null
}

export default class MatrixView extends React.PureComponent<RotationMatrixViewProps> {
  render() {
    if (!this.props.rows) {
      return null
    }

    return (
      <div style={{ fontFamily: 'Roboto Mono', fontSize: '12px', color: 'gray' }}>
        {
          this.props.rows.map((row: number[], i: number) => {
            return this.renderRow(row, i)
          }
          )}

      </div>
    )
  }

  private renderRow(row: number[], rowKey: number) {
    let firstThree = [row[0], row[1], row[2]]
    return (
      <div key={rowKey} style={{ display: 'flex' }}>
        {firstThree.map((element: number, i: number) => {
          return <span style={{ width: '33%', textAlign: 'left' }} key={i}>{element.toPrecision(5)}</span>
        })}
      </div>
    )
  }
}
