import * as React from 'react'
import Exporter from './exporter'
import { CameraParameters } from '../solver/solver-result'

export default class JSONExporter extends Exporter {
  get name(): string {
    return 'JSON'
  }
  get instructions(): JSX.Element {
    return (
      <div>
        <ul>
          <li> Field of view values are given in radians </li>
          <li> Principal point and vanishing point are given in image plane coordinates </li>
        </ul>
      </div>
    )
  }
  generateCode(cameraParameters: CameraParameters): string {
    return JSON.stringify(
      cameraParameters,
      null,
      2
    )
  }

  get codeLanguage(): string {
    return 'json'
  }
}
