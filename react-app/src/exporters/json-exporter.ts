import Exporter from "./exporter";

export default class JSONExporter extends Exporter {
  get name():string {
    return "JSON"
  }
  get instructions():string {
    return "Here's JSON!. Fov in radians, transform is 4x4 matrix"
  }
  get code():string {
    return JSON.stringify(this.solverResult, null, 2)
  }
  get codeLanguage(): string {
    return "json"
  }
}