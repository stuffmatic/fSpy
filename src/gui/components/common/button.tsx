import * as React from 'react'

interface ButtonProps {
  title: string
  fillWidth?: boolean
  isSelected?: boolean
  onClick(): void
}

export default function Button(props: ButtonProps) {

  let style: any = {
    width: '135px',
    height: '21px'
    /* backgroundColor: props.isSelected ? Palette.white : Palette.gray,
    outline: 'none',
    border: 'none',
    boxShadow: 'none'*/
  }

  if (props.fillWidth) {
    style.width = '100%'
  }

  return (
    <button style={style} onClick={() => props.onClick()}>
      {props.title}
    </button>
  )
}
