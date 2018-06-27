import Exporter from './exporter'
import * as React from 'react'
import CoordinatesUtil, { ImageCoordinateFrame } from '../solver/coordinates-util'
import { CameraParameters } from '../solver/solver-result'

export default class BlenderExporter extends Exporter {
  get name(): string {
    return 'Blender'
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

  generateCode(cameraParameters: CameraParameters): string {
    let fov = cameraParameters.horizontalFieldOfView
    let matrix = cameraParameters.cameraTransform.inverted().matrix
    let principalPointRelative = CoordinatesUtil.convert(
      cameraParameters.principalPoint,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      cameraParameters.imageWidth,
      cameraParameters.imageHeight
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
camera.data.shift_y = ` + cameraParameters.imageHeight / cameraParameters.imageWidth * (-0.5 + principalPointRelative.y) + `

#Set the rendered image size
#to match the calibration image
render_settings = bpy.context.scene.render
render_settings.resolution_x = ` + cameraParameters.imageWidth + `
render_settings.resolution_y = ` + cameraParameters.imageHeight + `
`
  }
  get codeLanguage(): string {
    return 'python'
  }
}
