import * as React from 'react'
import Exporter from './exporter'

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
  get code(): string {
    return JSON.stringify(
      {
        ...this.solverResult,
        imageWidth: this.image!.width, // TODO: null check
        imageHeight: this.image!.height
      },
      null,
      2
    )
  }
  get codeLanguage(): string {
    return 'json'
  }
}
