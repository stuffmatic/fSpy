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

import * as React from 'react'
import ControlPointsContainer from './containers/control-points-container'
import ResultContainer from './containers/result-container'
import SettingsContainer from './containers/settings-container'

import { StoreState } from './types/store-state'
import { connect } from 'react-redux'
import { AppAction, setImage, loadDefaultState, setSidePanelVisibility } from './actions'
import { GlobalSettings } from './types/global-settings'
import { UIState } from './types/ui-state'
import { ImageState } from './types/image-state'
import { SolverResult } from './solver/solver-result'
import { ipcRenderer, remote } from 'electron'
import { NewProjectMessage, OpenProjectMessage, SaveProjectMessage, SaveProjectAsMessage, OpenImageMessage, ExportMessage, ExportType, SetSidePanelVisibilityMessage } from '../main/ipc-messages'
import ProjectFile from './io/project-file'
import { readFileSync } from 'fs'
import { SpecifyProjectPathMessage, OpenDroppedProjectMessage, SpecifyExportPathMessage } from './ipc-messages'
import { loadImage } from './io/util'
import store from './store/store'
import SplashScreen from './components/splash-screen'
import { Dispatch } from 'redux'

interface AppProps {
  uiState: UIState,
  globalSettings: GlobalSettings,
  solverResult: SolverResult,
  image: ImageState,
  onImageFileDropped(imagePath: string): void
  onProjectFileDropped(imagePath: string): void
  onOpenExampleProjectPressed(): void

  onNewProjectIPCMessage(): void
  onOpenProjectIPCMessage(filePath: string, isExampleProject: boolean): void
  onSaveProjectAsIPCMessage(filePath: string): void
  onOpenImageIPCMessage(imagePath: string): void
  onExportIPCMessage(exportType: ExportType): void
  onSetSidePanelVisibilityIPCMessage(panelsAreVisible: boolean): void
}

class App extends React.PureComponent<AppProps> {

  constructor(props: AppProps) {
    super(props)
  }

  componentWillMount() {
    this.registerIPCHandlers()

    document.ondragover = (ev) => {
      ev.preventDefault()
      return false
    }

    document.ondragenter = (ev) => {
      ev.preventDefault()
      return false
    }

    document.ondragleave = (ev) => {
      ev.preventDefault()
      return false
    }

    document.ondrop = (ev) => {
      if (ev.dataTransfer != null) {
        let firstFile = ev.dataTransfer.files[0]
        if (firstFile) {
          let filePath = firstFile.path
          let isProjectFile = ProjectFile.isProjectFile(filePath)
          if (isProjectFile) {
            this.props.onProjectFileDropped(filePath)
          } else {
            // try to open the file as an image
            this.props.onImageFileDropped(filePath)
          }
        }
        ev.preventDefault()
        return false
      }
      return true
    }
  }

  render() {
    const hasImage = this.props.image.data !== null
    return (
      <div id='app-container'>
        <SettingsContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
        <ControlPointsContainer />
        <ResultContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
        { !hasImage ? (<SplashScreen onClickedLoadExampleProject={this.props.onOpenExampleProjectPressed} />) : null }
      </div>
    )
  }

  private registerIPCHandlers() {
    ipcRenderer.on(NewProjectMessage.type, (_: any, __: NewProjectMessage) => {
      this.props.onNewProjectIPCMessage()
    })

    ipcRenderer.on(OpenProjectMessage.type, (_: any, message: OpenProjectMessage) => {
      this.props.onOpenProjectIPCMessage(message.filePath, message.isExampleProject)
    })

    ipcRenderer.on(SaveProjectMessage.type, (_: any, __: SaveProjectMessage) => {
      if (this.props.uiState.projectFilePath) {
        this.props.onSaveProjectAsIPCMessage(this.props.uiState.projectFilePath)
      } else {
        ipcRenderer.send(SpecifyProjectPathMessage.type, new SpecifyProjectPathMessage())
      }
    })

    ipcRenderer.on(SaveProjectAsMessage.type, (_: any, message: SaveProjectAsMessage) => {
      this.props.onSaveProjectAsIPCMessage(message.filePath)
    })

    ipcRenderer.on(OpenImageMessage.type, (_: any, message: OpenImageMessage) => {
      this.props.onOpenImageIPCMessage(message.filePath)
    })

    ipcRenderer.on(ExportMessage.type, (_: any, message: ExportMessage) => {
      this.props.onExportIPCMessage(message.exportType)
    })

    ipcRenderer.on(SetSidePanelVisibilityMessage.type, (_: any, message: SetSidePanelVisibilityMessage) => {
      this.props.onSetSidePanelVisibilityIPCMessage(message.panelsAreVisible)
    })
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    uiState: state.uiState,
    globalSettings: state.globalSettings,
    solverResult: state.solverResult,
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onImageFileDropped: (imagePath: string) => {
      let imageBuffer = readFileSync(imagePath)
      // TODO: good to do async loading here?
      loadImage(
        imageBuffer,
        (width: number, height: number, url: string) => {
          dispatch(setImage(url, imageBuffer, width, height))
        },
        () => {
          remote.dialog.showErrorBox(
            'Failed to load image data',
            'Could not load the image data. Is this a valid image file?'
          )
        }
      )
    },
    onProjectFileDropped: (projectPath: string) => {
      ipcRenderer.send(
        OpenDroppedProjectMessage.type,
        new OpenDroppedProjectMessage(projectPath)
      )
    },
    onOpenExampleProjectPressed: () => {
      ProjectFile.loadExample(dispatch)
    },
    onNewProjectIPCMessage: () => {
      dispatch(loadDefaultState())
    },
    onOpenProjectIPCMessage: (filePath: string, isExampleProject: boolean) => {
      ProjectFile.load(filePath, dispatch, isExampleProject)
    },
    onSaveProjectAsIPCMessage: (filePath: string) => {
      ProjectFile.save(filePath, dispatch)
    },
    onOpenImageIPCMessage: (imagePath: string) => {
      let imageBuffer = readFileSync(imagePath)
      loadImage(
        imageBuffer,
        (width: number, height: number, url: string) => {
          dispatch(setImage(url, imageBuffer, width, height))
        },
        () => {
          alert('Failed to load image')
        }
      )
    },
    onOpenExampleProjectIPCMessage: () => {
      ProjectFile.loadExample(dispatch)
    },
    onExportIPCMessage: (exportType: ExportType) => {
      let dataToExport: any | null = null
      const storeState: StoreState = store.getState()
      switch (exportType) {
        case ExportType.CameraParametersJSON:
          const cameraParameters = storeState.solverResult.cameraParameters
          if (cameraParameters) {
            dataToExport = JSON.stringify(cameraParameters, null, 2)
          }
          break
        case ExportType.ProjectImage:
          dataToExport = storeState.image.data
          break
      }

      if (dataToExport) {
        ipcRenderer.send(
          SpecifyExportPathMessage.type,
          new SpecifyExportPathMessage(exportType, dataToExport)
        )
      }
    },
    onSetSidePanelVisibilityIPCMessage: (panelsAreVisible: boolean) => {
      dispatch(setSidePanelVisibility(panelsAreVisible))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
