import * as React from 'react';
import ImageContainer from './containers/image-container';
import ResultContainer from './containers/result-container';
import SettingsContainer from './containers/settings-container';
import ExportDialog from './components/export-dialog/export-dialog';

import './App.css';
import { StoreState } from './types/store-state';
import { Dispatch, connect } from 'react-redux';
import { AppAction, setExportDialogVisibility } from './actions';

interface AppProps {
  isExportDialogOpen: boolean
  onExportDialogVisiblityChange(isVisible: boolean): void
}

function App(props: AppProps) {
  return (
    <div id="app-container">
      <ExportDialog
        isVisible={props.isExportDialogOpen}
        onOpen={() => props.onExportDialogVisiblityChange(true)}
        onClose={() => props.onExportDialogVisiblityChange(false)} />
      <SettingsContainer />
      <ImageContainer />
      <ResultContainer />
    </div>
  );
}

export function mapStateToProps(state: StoreState) {
  return state.uiState
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onExportDialogVisiblityChange: (isVisible: boolean) => {
      dispatch(setExportDialogVisibility(isVisible))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
