import * as React from 'react';

interface ButtonProps {
  title: string
  onClick(): void
  fillWidth?: boolean
}

export default function Button(props: ButtonProps) {

  let style = {
    minWidth: "90px",
    height: "25px",
    backgroundColor: "#e0e0e0",
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