import Exporter from "./exporter";

export default class JSONExporter extends Exporter {
  get name():string {
    return "JSON"
  }
  get instructions():string {
    return "Here's JSON!"
  }
  get code():string {
    return '{ omg: "Check out this json code" }'
  }
}