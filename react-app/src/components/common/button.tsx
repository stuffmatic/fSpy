import * as React from 'react';

interface ButtonProps {
  title: string
  onClick(): void
}

export default function Button(props: ButtonProps) {
  return (
    <button className={"button"} onClick={() => props.onClick()}>
      {props.title}
    </button>
  )
}