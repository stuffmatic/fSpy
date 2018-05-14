import { SolverResult } from "../solver/solver-result";

export default abstract class Exporter {

  protected solverResult:SolverResult | null

  constructor() {
    this.solverResult = null
  }

  refresh(solverResult:SolverResult):void {
    this.solverResult = solverResult
  }

  abstract get name():string
  //TODO: return react element
  abstract get instructions():string
  abstract get code():string

  //must be a language name recognized by highlight.js
  abstract get codeLanguage():string
}