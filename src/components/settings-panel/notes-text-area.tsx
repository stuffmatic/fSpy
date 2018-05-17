import * as React from 'react';

interface NotesTextAreaProps {
  value:string
  onValueChange(value:string):void
}

export default class NotesTextArea extends React.PureComponent<NotesTextAreaProps> {
  render() {
    return (
      <textarea value={ this.props.value } onChange={
        (event:any) => {
          this.props.onValueChange(event.target.value)
        }
      }/>
    )
  }
}