import * as React from 'react';
import ImageContainer from './containers/image-container';
import ResultPanelContainer from './containers/result-panel-container';
import SettingsPanelContainer from './containers/settings-panel-container';

import './App.css';

const AppStyle: React.CSSProperties = {
  userSelect: "none",
  display: "flex",
  alignItems: "stretch"
}

class App extends React.Component {
  render() {
    return (
      <div style={ AppStyle}>
        <SettingsPanelContainer />
        <ImageContainer />
        <ResultPanelContainer />
      </div>
    );
  }
}

export default App;
