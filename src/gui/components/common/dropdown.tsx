import React from 'react'
import Select, { Option } from 'react-select'

interface DropdownProps<T> {
  options: DropdownOption<T>[]
  selectedOptionId: string
  onChange(selectedOption: T): void
}

export interface DropdownOption<T> {
  value: T
  id: string
  label: string
  dotColor?: string
}

export default class Dropdown<T> extends React.Component<DropdownProps<T>> {
  handleChange = (selectedOption: any) => {
    this.setState({ selectedOption })
  }
  render() {
    return (
      <Select
        clearable={false}
        name=''
        value={this.props.selectedOptionId}
        onChange={(selectedOption: Option | null) => {
          if (selectedOption !== null) {
            for (let option of this.props.options) {
              if (option.id == selectedOption.value) {
                this.props.onChange(option.value)
              }
            }
          }
        }}
        searchable={false}
        options={
          this.props.options.map(
            (option: DropdownOption<T>) => {
              return { value: option.id, label: option.label }
            }
          )
        }
      />
    )
  }
}
