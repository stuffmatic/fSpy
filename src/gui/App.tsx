import * as React from 'react'
import ControlPointsContainer from './containers/control-points-container'
import ResultContainer from './containers/result-container'
import SettingsContainer from './containers/settings-container'
import ExportDialog from './components/export-dialog/export-dialog'

import { StoreState } from './types/store-state'
import { Dispatch, connect } from 'react-redux'
import { AppAction, setExportDialogVisibility } from './actions'
import { GlobalSettings } from './types/global-settings'
import { UIState } from './types/ui-state'
import { ImageState } from './types/image-state'
import { SolverResult } from './solver/solver-result'

interface AppProps {
  uiState: UIState,
  globalSettings: GlobalSettings,
  solverResult: SolverResult,
  image: ImageState,
  onExportDialogVisiblityChange(isVisible: boolean): void
}

class App extends React.PureComponent<AppProps> {

  constructor(props: AppProps) {
    super(props)
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
