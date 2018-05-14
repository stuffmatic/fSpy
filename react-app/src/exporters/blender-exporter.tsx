import Exporter from "./exporter";
import * as React from 'react';

export default class BlenderExporter extends Exporter {
  get name(): string {
    return "Blender"
  }
  get instructions(): JSX.Element {
    return (
      <ul>
        <li>Select the camera you want to calibrate</li>
        <li>Open a text editor area</li>
        <li>Press new to create a new text block</li>
        <li>Paste the script to the left into the text editor (edit -> paste)</li>
        <li>Run the script (text -> run script></li>
      </ul>
    )
  }

  get code(): string {
    if (!this.solverResult || 
        !this.solverResult.horizontalFieldOfView ||
        !this.solverResult.cameraTransform ||
        !this.solverResult.principalPoint ||
        !this.image
    ) {
      return ""
    }

    let fov = this.solverResult.horizontalFieldOfView
    let matrix = this.solverResult.cameraTransform.matrix

    //TODO: null checks
    return `import bpy

#Get the active object, assuming it's a camera
camera = bpy.context.active_object

#Set the camera field of view in degrees
camera.data.lens_unit = 'FOV'
camera.data.lens = ` + (180 * fov / Math.PI) + `

#Set the orientation and location
#of the camera
camera.matrix_world = ` + JSON.stringify(matrix, null, 2) + `

#Set the principal point
camera.data.shift_x = 0
camera.data.shift_y = 0

#Set the rendered image size
#to match the calibration image
render_settings = bpy.context.scene.render
render_settings.resolution_x = ` + this.image.width + `
render_settings.resolution_y = ` + this.image.height + `

`
  }
  get codeLanguage(): string {
    return "python"
  }
}