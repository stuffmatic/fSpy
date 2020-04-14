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

import * as React from 'react'
import { cameraPresets } from '../../solver/camera-presets'
import { CameraData } from '../../types/calibration-settings'
import strings from '../../strings/strings'
import Dropdown from './dropdown'

export interface CameraPresetsDropdownProps {
  cameraData: CameraData
  onPresetChanged(presetId: string | null): void
}

export default function CameraPresetsDropdown(props: CameraPresetsDropdownProps) {

  let ids: (string | null)[] = []
  for (let id in cameraPresets) {
    ids.push(id)
  }
  ids.sort()
  ids.unshift(null)

  return (
    <div>
      <Dropdown
        options={
          ids.map(
            (id: string | null) => {
              return {
                value: id,
                id: id === null ? 'null' : id,
                title: id === null ? strings.customCameraPresetName : cameraPresets[id].displayName
              }
            }
          )
        }
        selectedOptionId={props.cameraData.presetId === null ? 'null' : props.cameraData.presetId}
        onOptionSelected={props.onPresetChanged}
      />
    </div>
  )
}
