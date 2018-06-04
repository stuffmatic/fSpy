import * as React from 'react'
import ImageContainer from './containers/image-container'
import ResultContainer from './containers/result-container'
import SettingsContainer from './containers/settings-container'
import ExportDialog from './components/export-dialog/export-dialog'

import { StoreState } from './types/store-state'
import { Dispatch, connect } from 'react-redux'
import { AppAction, setExportDialogVisibility } from './actions'
import { GlobalSettings, CalibrationMode } from './types/global-settings'
import { UIState } from './types/ui-state'
import CalibrationResult from './types/calibration-result'
import { ImageState } from './types/image-state'

interface AppProps {
  uiState: UIState,
  globalSettings: GlobalSettings,
  calibrationResult: CalibrationResult,
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
          solverResult={this.props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint ? this.props.calibrationResult.calibrationResult1VP : this.props.calibrationResult.calibrationResult2VP}
          image={this.props.image}
          onOpen={() => this.props.onExportDialogVisiblityChange(true)}
          onClose={() => this.props.onExportDialogVisiblityChange(false)}
        />
        <SettingsContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
        <ImageContainer />
        <ResultContainer isVisible={this.props.uiState.sidePanelsAreVisible} />
      </div>
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    uiState: state.uiState,
    globalSettings: state.globalSettings,
    calibrationResult: state.calibrationResult,
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
