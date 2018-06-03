import React from 'react'
import { Palette } from '../../style/palette'

export enum BulletListType {
  Warnings,
  Errors
}

interface BulletListProps {
  messages: string[]
  type: BulletListType
}

export default function BulletList(props: BulletListProps) {
  return (
    <ul style={
      {
        margin: 0,
        paddingLeft: '15px',
        color: props.type == BulletListType.Errors ? Palette.red : Palette.orange
      }
    }>
      {props.messages.map((message: string, i: number) => <li key={i}>{message}</li>)}
    </ul>
  )
}
