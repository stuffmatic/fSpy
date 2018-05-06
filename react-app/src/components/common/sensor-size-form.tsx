import * as React from 'react';
import Dropdown from './dropdown'
import { CameraData, cameraPresets } from '../../solver/camera-data';

export default function SensorSizeForm() {
  return (
    <div>
      <Dropdown
        options={
          cameraPresets.map(
            (preset:CameraData) => {
              return {
                value: preset,
                id: preset.id,
                label: preset.displayName
              }
            }
          )
        }
        selectedOptionId={""}
        onChange={(selectedOption:CameraData) => {

        }}
      />
    </div>
  )
}