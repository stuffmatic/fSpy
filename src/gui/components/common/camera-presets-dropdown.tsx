import * as React from 'react'
import Dropdown from './dropdown'
import { cameraPresets } from '../../solver/camera-presets'
import { CameraData } from '../../types/calibration-settings'
import strings from '../../strings/strings'

export interface CameraPresetsDropdownProps {
  cameraData: CameraData
  onPresetChanged(presetId: string | null): void
}

export default function CameraPresetsDropdown(props: CameraPresetsDropdownProps) {

  let ids: (string | null)[] = [null]
  for (let id in cameraPresets) {
    ids.push(id)
  }
  ids.sort()

  return (
    <div>
      <Dropdown
        options={
          ids.map(
            (id: string | null) => {
              return {
                value: id,
                id: id === null ? 'null' : id,
                label: id === null ? strings.customCameraPresetName : cameraPresets[id].displayName
              }
            }
          )
        }
        selectedOptionId={props.cameraData.presetId === null ? 'null' : props.cameraData.presetId}
        onChange={props.onPresetChanged}
      />
    </div>
  )
}
