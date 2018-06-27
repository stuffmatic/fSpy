import { CameraParameters } from '../solver/solver-result'

export default abstract class Exporter {

  protected cameraParameters: CameraParameters | null

  constructor() {
    this.cameraParameters = null
  }

  refresh(cameraParameters: CameraParameters): void {
    this.cameraParameters = cameraParameters
  }

  abstract get name(): string
  abstract get instructions(): JSX.Element
  abstract generateCode(cameraParameters: CameraParameters): string

  // must be a language name recognized by highlight.js
  abstract get codeLanguage(): string
}
