import * as React from 'react'
import Button from '../common/button'
import { clipboard } from 'electron'

interface TableRowProps {
  title: string
  value: number | null
}

export default class TableRow extends React.PureComponent<TableRowProps> {
  render() {
    return (
      <div style={{ display: 'flex', lineHeight: '24px' }}>
        <span style={{ width: '50px' }}>{this.props.title}</span>
        <span style={{ fontFamily: 'monospace' }}> {this.valueDisplayString}</span>
        <span style={{ flexGrow: 1, textAlign: 'right' }}>
          <Button width='50px' title='Copy' onClick={ () => {
            clipboard.writeText(this.valueClipboardString)
          } }/>
        </span>
      </div>
    )
  }

  private get valueClipboardString(): string {
    if (this.props.value === null) {
      return 'null'
    }
    return this.props.value.toString()
  }

  private get valueDisplayString(): string {
    if (this.props.value === null) {
      return 'n/a'
    }
    const value = this.props.value
    let result = ''
    if (typeof value === 'number') {
      if (value == Math.floor(value)) {
        result += this.props.value
      } else {
        result += this.props.value.toPrecision(7)
      }
    } else {
      result += this.props.value
    }

    return result
  }
}
