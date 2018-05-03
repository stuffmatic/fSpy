import * as React from 'react';
import Select from 'react-select';

export default class Dropdown extends React.Component {
  state = {
    selectedOption: 'two',
  }
  handleChange = (selectedOption:any) => {
    this.setState({ selectedOption });
    console.log('Selected: ${selectedOption.label}');
  }
  render() {
  	const { selectedOption } = this.state;

    return (
      <Select
        clearable={false}
        name="form-field-name"
        value={selectedOption}
        onChange={this.handleChange}
        searchable={false}

        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' },
        ]}
      />
    );
  }
}