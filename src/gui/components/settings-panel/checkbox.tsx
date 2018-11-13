import React from 'react'

interface CheckboxProps {
  title: string
  isSelected: boolean
  onChange(isSelected: boolean): void
}

export default function Checkbox(props: CheckboxProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} >
      <div>{props.title}</div>
      <div style={{ flexGrow: 1, textAlign: 'right' }}>
        <input
          style={{ marginRight: 0 }}
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
