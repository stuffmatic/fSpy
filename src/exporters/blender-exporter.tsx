import Exporter from "./exporter";
import * as React from 'react';
import CoordinatesUtil, { ImageCoordinateFrame } from "../solver/coordinates-util";

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
        <li>Set background image</li>
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
    let matrix = this.solverResult.cameraTransform.inverted().matrix
    let principalPointRelative = CoordinatesUtil.convert(
      this.solverResult.principalPoint,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      this.image.width!, //TODO: null checks
      this.image.height!
    )

    return `import bpy
import mathutils

#Get the active object, assuming it's a camera
camera = bpy.context.active_object

#Set the camera field of view in radians
camera.data.type = 'PERSP'
camera.data.lens_unit = 'FOV'
camera.data.angle = ` + fov + `

#Set the orientation and location
#of the camera
camera.matrix_world = mathutils.Matrix(` + JSON.stringify(matrix, null, 2) + `)

#Set the principal point
camera.data.shift_x = ` + (0.5 - principalPointRelative.x) + `
camera.data.shift_y = ` + (-0.5 + principalPointRelative.y) + `

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