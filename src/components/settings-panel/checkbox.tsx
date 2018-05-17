import * as React from 'react';

interface CheckboxProps {
  title: string
  isSelected: boolean
  onChange(isSelected: boolean): void
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div className="panel-row" >
      <input
        name={props.title}
        type="checkbox"
        checked={props.isSelected}
        onChange={(event: any) => {
          props.onChange(event.target.checked)
        }}
      /> {props.title}
    </div>
  )
}