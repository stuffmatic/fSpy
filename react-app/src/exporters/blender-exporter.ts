import Exporter from "./exporter";

export default class BlenderExporter extends Exporter {
  get name(): string {
    return "Blender"
  }
  get instructions(): string {
    return "Do stuff in Blender, copy paste etc omg lolz"
  }
  get code(): string {
    return `import lolface
a = "hello!"
b = [1, 2, 3]
print "OMG"

def hello():
  print "Hello"
`
  }
  get codeLanguage(): string {
    return "python"
  }
}