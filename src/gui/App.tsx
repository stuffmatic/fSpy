import React from 'react'
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

function App(props: AppProps) {
  return (

    <div id='app-container'>
      <ExportDialog
        isVisible={props.uiState.isExportDialogOpen}
        solverResult={props.globalSettings.calibrationMode == CalibrationMode.OneVanishingPoint ? props.calibrationResult.calibrationResult1VP : props.calibrationResult.calibrationResult2VP}
        image={props.image}
        onOpen={() => props.onExportDialogVisiblityChange(true)}
        onClose={() => props.onExportDialogVisiblityChange(false)}
      />
      <SettingsContainer isVisible={props.uiState.sidePanelsAreVisible} />
      <ImageContainer />
      <ResultContainer isVisible={props.uiState.sidePanelsAreVisible} />
    </div>
  )
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
