import * as React from 'react';

interface TableRowProps {
  title: string
  value: string | number | null
  unit?: string
}

export default class TableRow extends React.PureComponent<TableRowProps> {
  render() {
    return (
      <div className="panel-row" >
        <div style={{display: "flex"}}>
          <span style={{flexGrow: 1}}>{this.props.title}</span>
          <span style={{ textAlign: "right" }}> {this.valueString}</span>
        </div>
      </div>
    )
  }

  private get valueString():string {
    if (this.props.value == null) {
      return "n/a"
    }

    let result = ""
    if (typeof this.props.value == "number") {
      result += (this.props.value as number).toPrecision(7)
    }
    else {
      result += this.props.value
    }

    if (this.props.unit) {
      result += this.props.unit
    }

    return result
  }

}