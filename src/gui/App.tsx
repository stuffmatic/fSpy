import * as React from 'react'
import ControlPointsContainer from './containers/control-points-container'
import ResultContainer from './containers/result-container'
import SettingsContainer from './containers/settings-container'
import ExportDialog from './components/export-dialog/export-dialog'

import { StoreState } from './types/store-state'
import { Dispatch, connect } from 'react-redux'
import { AppAction, setExportDialogVisibility, setImage, loadDefaultState } from './actions'
import { GlobalSettings } from './types/global-settings'
import { UIState } from './types/ui-state'
import { ImageState } from './types/image-state'
import { SolverResult } from './solver/solver-result'
import { ipcRenderer, remote } from 'electron'
import { NewProjectMessage, OpenProjectMessage, SaveProjectMessage, SaveProjectAsMessage, OpenImageMessage } from '../main/ipc-messages'
import ProjectFile from './io/project-file'
import { readFileSync } from 'fs'
import { SpecifyProjectPathMessage, OpenDroppedProjectMessage } from './ipc-messages'
import { loadImage } from './io/util'

interface AppProps {
  uiState: UIState,
  globalSettings: GlobalSettings,
  solverResult: SolverResult,
  image: ImageState,
  onExportDialogVisiblityChange(isVisible: boolean): void
  onImageFileDropped(imagePath: string): void
  onProjectFileDropped(imagePath: string): void

  onNewProjectIPCMessage(): void
  onOpenProjectIPCMessage(filePath: string, isExampleProject: boolean): void
  onSaveProjectAsIPCMessage(filePath: string): void
  onOpenImageIPCMessage(imagePath: string): void
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
  }

  render() {
    return (
      <div id='app-container'>
        <ExportDialog
          isVisible={this.props.uiState.isExportDialogOpen}
          cameraParameters={this.props.solverResult.cameraParameters}
          image={this.props.image}
          onOpen={() => this.props.onExportDialogVisiblityChange(true)}
          onClose={() => this.props.onExportDialogVisiblityChange(false)}
        />
        <SettingsContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
        <ControlPointsContainer />
        <ResultContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
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
    onExportDialogVisiblityChange: (isVisible: boolean) => {
      dispatch(setExportDialogVisibility(isVisible))
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
