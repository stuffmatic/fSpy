import * as React from 'react'
import Button from '../common/button'
import { clipboard } from 'electron'

interface TableRowProps {
  title: string
  value: number | null
  isFirstRow?: boolean
  isLastRow?: boolean
}

export default class TableRow extends React.PureComponent<TableRowProps> {
  render() {

    const style: any = { display: 'flex', lineHeight: '24px' }
    if (this.props.isFirstRow == true) {
      style.marginTop = '5px'
    } else if (this.props.isLastRow == true) {
      style.marginBottom = '-5px'
    }

    return (
      <div style={ style }>
        <span style={{ paddingLeft: '2px', width: '80px' }}>{this.props.title}</span>
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
