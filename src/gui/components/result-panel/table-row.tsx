/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
