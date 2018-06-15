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
import { ipcRenderer } from 'electron'
import { NewProjectMessage, OpenProjectMessage, SaveProjectMessage, SaveProjectAsMessage, OpenImageMessage, OpenExampleProjectMessage } from '../main/ipc-messages'
import ProjectFile from './io/project-file'
import { readFileSync } from 'fs'
import { SpecifyProjectPathMessage } from './ipc-messages'
import { loadImage } from './io/util'

interface AppProps {
  uiState: UIState,
  globalSettings: GlobalSettings,
  solverResult: SolverResult,
  image: ImageState,
  onExportDialogVisiblityChange(isVisible: boolean): void

  onNewProjectIPCMessage(): void
  onOpenProjectIPCMessage(filePath: string): void
  onSaveProjectAsIPCMessage(filePath: string): void
  onOpenImageIPCMessage(imagePath: string): void
  onOpenExampleProjectIPCMessage(): void
}

class App extends React.PureComponent<AppProps> {

  constructor(props: AppProps) {
    super(props)
  }

  componentWillMount() {
    // TODO: Is this the right place to do this?
    this.registerIPCHandlers()
  }

  render() {
    return (
      <div id='app-container'>
        <ExportDialog
          isVisible={this.props.uiState.isExportDialogOpen}
          solverResult={this.props.solverResult}
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
      this.props.onOpenProjectIPCMessage(message.filePath)
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

    ipcRenderer.on(OpenExampleProjectMessage.type, (_: any, __: OpenExampleProjectMessage) => {
      this.props.onOpenExampleProjectIPCMessage()
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
    onExportDialogVisiblityChange: (isVisible: boolean) => {
      dispatch(setExportDialogVisibility(isVisible))
    },
    onNewProjectIPCMessage: () => {
      dispatch(loadDefaultState())
    },
    onOpenProjectIPCMessage: (filePath: string) => {
      ProjectFile.load(filePath, dispatch, false)
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
