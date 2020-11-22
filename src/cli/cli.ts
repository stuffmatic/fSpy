/**
 * fSpy
 * Copyright (c) 2020 - Per Gantelius
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import minimist from 'minimist'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import SavedState from '../gui/io/saved-state'
import { CalibrationMode } from '../gui/types/global-settings'
import Solver from '../gui/solver/solver'
import { ImageState } from '../gui/types/image-state'
import { SolverResult } from '../gui/solver/solver-result'

const helpMessage = `\
Usage:
  fSpy (-h | --help)
   Show this help message

  fSpy [--open <imgPath>] [--wd <folderPath>]
   Open fSpy in GUI mode. Optional arguments to load an image and
   set a default working directory.

  fSpy -w <width> -h <height> -s <statePath> -o <resultPath>
   CLI mode. The fSpy CLI is used to compute camera parameters
   without using the GUI. Image data is not used for this process,
   only the image dimensions are required.

Options:
    -w  The width of the input image.
    -h  The height of the input image.
    -s  Path to a JSON file with project state data, the shape
        of which is described by the SavedState interface.
    -o  A path to write the solver result to. The shape of
        the data is described by the SolverResult interface.
--open  A path to an image file for fSpy to load on launch
  --wd  A path to a folder, for all open/save dialogs to open to
        by default.
`
export class CLI {

  static printUsage() {
    console.log(helpMessage)
  }

  static run(argv: string[]) {
    const args = minimist(argv)

    let hasValidOptions = true
    const imageWidthString = args.w
    hasValidOptions = hasValidOptions && imageWidthString != undefined
    const imageHeightString = args.h
    hasValidOptions = hasValidOptions && imageHeightString != undefined
    const statePath = args.s
    hasValidOptions = hasValidOptions && statePath != undefined
    const outputPath = args.o
    hasValidOptions = hasValidOptions && outputPath != undefined

    if (!hasValidOptions) {
      this.printUsage()
      return
    }

    const imageWidth = parseFloat(imageWidthString)
    const imageHeight = parseFloat(imageHeightString)

    if (isNaN(imageWidth) || isNaN(imageHeight)) {
      console.log('Error: got invalid image dimensions')
      return
    }

    if (!existsSync(statePath)) {
      console.log('Error: project state file ' + statePath + ' does not exist')
      return
    }

    const imageState: ImageState = {
      width: imageWidth,
      height: imageHeight,
      url: null,
      data: null
    }

    const projectState: SavedState = JSON.parse(readFileSync(statePath).toString())
    const is1VPMode = projectState.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint
    let solverResult: SolverResult
    if (is1VPMode) {
      solverResult = Solver.solve1VP(
        projectState.calibrationSettingsBase,
        projectState.calibrationSettings1VP,
        projectState.controlPointsStateBase,
        projectState.controlPointsState1VP,
        imageState
      )
    } else {
      solverResult = Solver.solve2VP(
        projectState.calibrationSettingsBase,
        projectState.calibrationSettings2VP,
        projectState.controlPointsStateBase,
        projectState.controlPointsState2VP,
        imageState
      )
    }

    writeFileSync(outputPath, JSON.stringify(solverResult, null, 2))
  }
}
