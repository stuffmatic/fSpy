import Exporter from "./exporter";

export default class JSONExporter extends Exporter {
  get name():string {
    return "JSON"
  }
  get instructions():string {
    return "Here's JSON!"
  }
  get code():string {
    return JSON.stringify([
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"},
      {omg: "hello!"}
    ], null, 2)
  }
  get codeLanguage(): string {
    return "json"
  }
}