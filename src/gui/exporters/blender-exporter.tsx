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
      <div>
        <ol>
          <li>Press the <em>copy code</em> button below to copy the import script to the clipboard</li>
          <li>Open Blender</li>
          <li>Select the camera you want to calibrate</li>
          <li>Open a text editor area</li>
          <li>Press new to create a new text block</li>
          <li>Paste the import script into the text editor (choose <em>Paste</em> from the <em>Edit</em> menu)</li>
          <li>Run the script (choose <em>Run script</em> from the <em>Text</em> menu)</li>
          <li>Set the background image to the one used for calibration</li>
        </ol>
      </div>
    )
  }

  generateCode(cameraParameters: CameraParameters): string {
    let fov = cameraParameters.horizontalFieldOfView
    let matrix = cameraParameters.viewTransform.inverted().matrix
    let principalPointRelative = CoordinatesUtil.convert(
      cameraParameters.principalPoint,
      ImageCoordinateFrame.ImagePlane,
      ImageCoordinateFrame.Relative,
      cameraParameters.imageWidth,
      cameraParameters.imageHeight
    )

    let xShiftScale = 1
    let yShiftScale = 1
    if (cameraParameters.imageHeight > cameraParameters.imageWidth) {
      xShiftScale = cameraParameters.imageWidth / cameraParameters.imageHeight
    } else {
      yShiftScale = cameraParameters.imageHeight / cameraParameters.imageWidth
    }

    return `# This is a Blender python script that sets up
# the current camera (assumed to be the current active object)
# to match the computed camera parameters

import bpy
import mathutils

# Helper for showing popup messages
def show_popup(title, message, type = 'ERROR'):
  def draw_popup(self, context):
    self.layout.label(message)
  bpy.context.window_manager.popup_menu(draw_popup, title, type)

# Get the active object, assuming it's a camera
camera = bpy.context.active_object

if not camera:
  show_popup(
    'fSpy import error',
    'There is no active object. Select a camera and try again.'
  )
elif camera.type != 'CAMERA':
  show_popup(
    'fSpy import error',
    'The active object is not a camera. Select a camera and try again.'
  )
else:
  # Set the camera field of view in radians
  camera.data.type = 'PERSP'
  camera.data.lens_unit = 'FOV'
  camera.data.angle = ` + fov + `

  # Set the orientation and location
  # of the camera
  camera.matrix_world = mathutils.Matrix(` + JSON.stringify(matrix, null, 2) + `)

  # Set the principal point
  camera.data.shift_x = ` + xShiftScale * (0.5 - principalPointRelative.x) + `
  camera.data.shift_y = ` + yShiftScale * (-0.5 + principalPointRelative.y) + `

  # Set the rendered image size
  # to match the calibration image
  render_settings = bpy.context.scene.render
  render_settings.resolution_x = ` + cameraParameters.imageWidth + `
  render_settings.resolution_y = ` + cameraParameters.imageHeight + `

  show_popup(
    'fSpy import completed',
    'Updated camera parameters for "' + camera.name + '"',
    'INFO'
  )
`
  }
  get codeLanguage(): string {
    return 'python'
  }
}
