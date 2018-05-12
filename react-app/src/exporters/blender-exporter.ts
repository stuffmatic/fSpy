import Exporter from "./exporter";

export default class BlenderExporter extends Exporter {
  get name(): string {
    return "Blender"
  }
  get instructions(): string {
    return `This is a simple lol
    lol

    get it?
`
  }
  get code(): string {
    return `import bpy

#Get the active object, assuming it's a camera
camera = bpy.context.active_object

#Set the camera field of view
camera.data.lens_unit = 'FOV'
fov_in_degrees = 40
camera.data.lens = fov_in_degrees

#Set the orientation and location
#of the camera
camera.matrix_world = [
  [1, 0, 0, 1],
  [0, 1, 0, 2],
  [0, 0, 1, 3],
  [0, 0, 0, 1]
]

#Set the principal point
camera.data.shift_x = 0
camera.data.shift_y = 0

#Set the rendered image size
#to match the calibration image
render_settings = bpy.context.scene.render
render_settings.resolution_x = 100
render_settings.resolution_y = 100

`
  }
  get codeLanguage(): string {
    return "python"
  }
}