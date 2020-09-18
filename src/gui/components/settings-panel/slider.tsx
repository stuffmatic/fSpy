/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'

interface SliderProps {
  title: string
  rangeMin: number
  rangeMax: number
  rangeStep: number
  value: number
  onChange(value: number): void
}

export default function Slider(props: SliderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }} >
      <div>{props.title}</div>
      <div style={{ flexGrow: 1, textAlign: 'right' }}>
        <input
          style={{ marginRight: 0 }}
          name={props.title}
          type='range'
          min={props.rangeMin}
          max={props.rangeMax}
          step={props.rangeStep}
          value={props.value}
          onChange={(event: any) => {
            props.onChange(event.target.value)
          }}
      />
      </div>
    </div>
  )
}
