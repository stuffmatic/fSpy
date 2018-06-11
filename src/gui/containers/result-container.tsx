import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { AppAction, setExportDialogVisibility } from '../actions'

import { ImageState } from '../types/image-state'
import { StoreState } from '../types/store-state'
import ResultPanel from '../components/result-panel/result-panel'
import { SolverResult } from '../solver/solver-result'

interface ResultContainerProps {
  isVisible: boolean
  solverResult: SolverResult
  image: ImageState

  onExportClicked(): void
}

class ResultContainer extends React.PureComponent<ResultContainerProps> {
  render() {
    if (!this.props.isVisible) {
      return null
    }

    return (
      <ResultPanel
        solverResult={this.props.solverResult}
        image={this.props.image}
        onExportClicked={this.props.onExportClicked}
      />
    )
  }
}

export function mapStateToProps(state: StoreState) {
  return {
    calibrationMode: state.globalSettings.calibrationMode,
    solverResult: state.solverResult,
    image: state.image
  }
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onExportClicked: () => {
      dispatch(setExportDialogVisibility(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultContainer)
