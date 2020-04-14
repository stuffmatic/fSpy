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
import { Palette } from '../../style/palette'

interface NumericInputFieldProps {
  precision?: number
  isDisabled?: boolean
  valueNotAvailable?: boolean
  value: number
  onSubmit(value: number): void
}

interface NumericInputFieldState {
  isEditing: Boolean
  editedValue: string
  editedValueIsValid: Boolean
}

export default class NumericInputField extends React.Component<NumericInputFieldProps, NumericInputFieldState> {

  constructor(props: NumericInputFieldProps) {
    super(props)
    this.state = {
      isEditing: false,
      editedValue: props.value.toString(),
      editedValueIsValid: true
    }
  }

  handleChange(event: any) {
    this.setState({
      ...this.state,
      editedValue: event.target.value,
      editedValueIsValid: this.numericValue(event.target.value) !== undefined
    })
  }

  handleSubmit(event: any) {
    event.preventDefault()
    this.finishEditing()
    event.target.blur()
  }

  handleFocus(_: any) {
    this.beginEditing()
  }

  handleBlur(_: any) {
    this.cancelEditing()
  }

  render() {
    let inputStyle: any = {
      height: '22px',
      outline: 'none',
      width: '60px',
      paddingLeft: '6px',
      border: '1px solid ' + Palette.gray
    }

    if (this.props.isDisabled) {
      inputStyle = {
        ...inputStyle,
        userSelect: 'none',
        cursor: 'default',
        color: Palette.disabledTextColor
      }
    }

    if (this.state.isEditing) {
      if (this.state.editedValueIsValid) {
        inputStyle = {
          ...inputStyle,
          border: '1px solid ' + Palette.green
        }
      } else {
        inputStyle = {
          ...inputStyle,
          border: '1px solid ' + Palette.red
        }
      }
    }

    let displayValue = this.props.precision ? this.props.value.toFixed(this.props.precision) : this.props.value
    if (this.props.valueNotAvailable) {
      displayValue = 'n/a'
    }

    return (
      <input
        disabled={this.props.isDisabled}
        style={inputStyle}
        type='text'
        value={this.state.isEditing ? this.state.editedValue : displayValue}
        onChange={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleChange(event)
          }
        }}
        onFocus={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleFocus(event)
          }
        }}
        onBlur={(event: any) => {
          if (!this.props.isDisabled) {
            this.handleBlur(event)
          }
        }}
        onKeyDown={(event: any) => {
          if (!this.props.isDisabled) {
            if (event.key == 'Escape') {
              this.cancelEditing()
              event.target.blur()
            } else if (event.key == 'Enter') {
              if (this.state.editedValueIsValid) {
                this.handleSubmit(event)
              }
            }
          }
        }}
      />
    )
  }

  private beginEditing() {
    this.setState({
      ...this.state,
      isEditing: true,
      editedValue: this.props.value.toString(),
      editedValueIsValid: true
    })
  }

  private finishEditing() {
    this.setState({
      ...this.state,
      isEditing: false
    })
    let numericValue = this.numericValue(this.state.editedValue)
    this.props.onSubmit(numericValue === undefined ? 0 : numericValue)
  }

  private cancelEditing() {
    this.setState({
      ...this.state,
      isEditing: false
    })
  }

  private numericValue(stringValue: string): number | undefined {
    let value = parseFloat(stringValue)
    return isNaN(value) ? undefined : value
  }
}
