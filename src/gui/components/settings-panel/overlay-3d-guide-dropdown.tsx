import * as React from 'react'
import Dropdown from './../common/dropdown'
import { Overlay3DGuide } from '../../types/global-settings'

interface Overlay3DGuideDropdownProps {
  overlay3DGuide: Overlay3DGuide
  onChange(overlay3DGuide: Overlay3DGuide): void
}

const options = [
  {
    value: Overlay3DGuide.None,
    id: Overlay3DGuide.None,
    label: 'Off'
  },
  {
    value: Overlay3DGuide.Box,
    id: Overlay3DGuide.Box,
    label: 'Box'
  },
  {
    value: Overlay3DGuide.YZGridFloor,
    id: Overlay3DGuide.YZGridFloor,
    label: 'yz grid floor'
  },
  {
    value: Overlay3DGuide.ZXGridFloor,
    id: Overlay3DGuide.ZXGridFloor,
    label: 'xz grid floor'
  },
  {
    value: Overlay3DGuide.XYGridFloor,
    id: Overlay3DGuide.XYGridFloor,
    label: 'xy grid floor'
  }
]

export default function Overlay3DGuideDropdown(props: Overlay3DGuideDropdownProps) {
  return (
    <Dropdown
      options={options}
      selectedOptionId={props.overlay3DGuide}
      onChange={props.onChange}
    />
  )
}
