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
        <p></p>
        <ul>
          <li>Field of view values are given in radians</li>
          <li>The principal and vanishing points are given in image plane coordinates</li>
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
