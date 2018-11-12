import React from 'react'

interface CheckboxProps {
  title: string
  isSelected: boolean
  onChange(isSelected: boolean): void
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div style={{ display: 'flex' }} >
      <div>{props.title}</div>
      <div style={{ flexGrow: 1, textAlign: 'right' }}>
        <input
        name={props.title}
        type='checkbox'
        checked={props.isSelected}
        onChange={(event: any) => {
          props.onChange(event.target.checked)
        }}
      />
      </div>
    </div>
  )
}
