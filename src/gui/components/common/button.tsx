import * as React from 'react'

interface ButtonProps {
  title: string
  width?: string
  height?: string
  isSelected?: boolean
  onClick(): void
}

export default function Button(props: ButtonProps) {

  let style: any = {
    width: '135px'
    /* backgroundColor: props.isSelected ? Palette.white : Palette.gray,
    outline: 'none',
    border: 'none',
    boxShadow: 'none'*/
  }

  if (props.width) {
    style.width = props.width
  }

  if (props.height) {
    style.height = props.height
  }

  return (
    <button style={style} onClick={() => props.onClick()}>
      {props.title}
    </button>
  )
}
