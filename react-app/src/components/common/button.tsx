import * as React from 'react';
import { Palette } from '../../style/palette';

interface ButtonProps {
  title: string
  onClick(): void
  fillWidth?: boolean
  isSelected?:boolean
}

export default function Button(props: ButtonProps) {

  let style = {
    minWidth: "90px",
    height: "25px",
    backgroundColor: props.isSelected ? Palette.white : Palette.gray,
    outline: "none",
    border: "none",
    boxShadow: "none"
  }

  if (props.fillWidth === true) {
    (style as any).width = "100%";
  }

  return (
    <button style={style} onClick={() => props.onClick()}>
      {props.title}
    </button>
  )
}