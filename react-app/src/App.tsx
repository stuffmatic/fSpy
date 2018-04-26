import * as React from 'react';
import ImageContainer from './containers/image-container';
import ResultContainer from './containers/result-container';
import SettingsContainer from './containers/settings-container';

import './App.css';

const AppStyle: React.CSSProperties = {
  userSelect: "none",
  display: "flex",
  alignItems: "stretch"
}

function App() {
  return (
    <div style={ AppStyle}>
      <SettingsContainer />
      <ImageContainer  />
      <ResultContainer />
    </div>
  );
}

export default App;
