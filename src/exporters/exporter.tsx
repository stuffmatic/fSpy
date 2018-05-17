import { SolverResult } from "../solver/solver-result";
import { ImageState } from "../types/image-state";

export default abstract class Exporter {

  protected solverResult:SolverResult | null
  protected image:ImageState | null

  constructor() {
    this.solverResult = null
  }

  refresh(solverResult:SolverResult, image:ImageState):void {
    this.solverResult = solverResult
    this.image = image
  }

  abstract get name():string
  //TODO: return react element
  abstract get instructions():JSX.Element
  abstract get code():string

  //must be a language name recognized by highlight.js
  abstract get codeLanguage():string
}