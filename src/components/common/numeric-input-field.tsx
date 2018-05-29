import * as React from 'react';
import { Palette } from '../../style/palette';

interface NumericInputFieldProps {
  value: number
  onSubmit(value: number): void
}

interface NumericInputFieldState {
  isEditing:Boolean
  editedValue:string
  editedValueIsValid:Boolean
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
      editedValueIsValid: this.numericValue(event.target.value) != undefined
    })
  }

  handleSubmit(event: any) {
    event.preventDefault()
    this.finishEditing()
  }

  handleFocus(event: any) {
    this.beginEditing()
  }

  handleBlur(event: any) {
    if (this.state.isEditing) {
      this.finishEditing()
    }
    else {
      //the user canceled editing and blur was called explicitly
    }
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
    this.props.onSubmit(numericValue == undefined ? 0 : numericValue)
  }

  private cancelEditing() {
    this.setState({
      ...this.state,
      isEditing: false
    })
  }

  private numericValue(stringValue:string): number | undefined {
    let value = parseFloat(stringValue)
    return isNaN(value) ? undefined : value
  }

  render() {
    let inputStyle:any = { border:"none", outline: "none" }
    if (this.state.isEditing) {
      if (this.state.editedValueIsValid) {
        inputStyle = {
          ...inputStyle,
          border: "1px solid" + Palette.green
        }
      }
      else {
        inputStyle = {
          ...inputStyle,
          border: "1px solid" + Palette.red
        }
      }
    }

    return (
      <form onSubmit={(event: any) => {
        this.handleSubmit(event)
      }}>
        <input
          style={ inputStyle }
          type="text"
          value={this.state.isEditing ? this.state.editedValue : this.props.value}
          onChange={(event: any) => {
            this.handleChange(event)
          }}
          onFocus={(event: any) => {
            this.handleFocus(event)
          }}
          onBlur={(event: any) => {
            this.handleBlur(event)
          }}
          onKeyDown={(event: any) => {
            if (event.key == 'Escape') {
              this.cancelEditing()
              event.target.blur()
            }
          }}
        />
        <input style={{ display: "none" }} type="submit" value="Submit" />
      </form>
    );
  }
}