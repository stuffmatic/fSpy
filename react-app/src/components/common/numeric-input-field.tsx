import * as React from 'react';

interface NumericInputFieldProps {
  value: number
  onSubmit(value: number): void
}

export default class NumericInputField extends React.Component<NumericInputFieldProps> {

  state = {
    stringValue: "",
    initialValue: "",
    valueIsValid: false
  }

  handleChange(event: any) {
    console.log("handleChange " + event.target.value)
    let numericValue = this.numericValue()
    this.setState({
      ...this.state,
      stringValue: event.target.value,
      valueIsValid: numericValue !== undefined
    });

  }

  handleSubmit(event:any) {
    event.preventDefault()
    let numericValue = this.numericValue()
    if (numericValue !== undefined) {
      console.log("Valid submit")
    }
    else {
      console.log("Invalid submit")
    }
  }

  handleFocus(event: any) {
    console.log("handleFocus")
    this.setState({ initialValue: event.target.value });
  }

  handleBlur(event:any) {
    console.log("handleBlur")
    this.setState({ stringValue: this.props.value });
  }

  private numericValue(): number |  undefined {
    let value = parseFloat(this.state.stringValue)
    console.log("Parsed " + this.state.stringValue + " to " + value)
    return isNaN(value) ? undefined : value
  }

  render() {
    return (
      <form onSubmit={(event:any) => {
        this.handleSubmit(event)
      }}>
        <label style={{ backgroundColor: this.state.valueIsValid ? "none" : "red" }}>
          <input
            type="text"
            value={this.state.stringValue}
            onChange={(event:any) => {
              this.handleChange(event)
            }}
            onFocus={(event:any) => {
              this.handleFocus(event)
            }}
            onBlur={(event:any) => {
              this.handleBlur(event)
            }}
          />
        </label>
        <input style={{ display: "none" }} type="submit" value="Submit" />
      </form>
    );
  }
}