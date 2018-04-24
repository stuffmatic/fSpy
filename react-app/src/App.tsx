import * as React from 'react';
import ImageContainer from './containers/image-container';
import './App.css';

const SidePanelStyle: any = {
  backgroundColor: "#f0f0f0",
  flex: "0 0 160px",
  padding: "5px"
}

const SettingsPanelStyle: any = {
  ...SidePanelStyle
}


interface DropdownProps {
  items: string[]
}

const DropDownStyle: any = {

}

class Dropdown extends React.Component<DropdownProps> {
  render() {
    return (
      <select style={DropDownStyle}>
        {this.props.items.map((item) => {
          <option key={item} value={item}> {item} </option>
        })}
      </select>
    )
  }
}

interface ControlLabelProps {
  text: string
}

class ControlLabel extends React.Component<ControlLabelProps> {
  render() {
    return (
      <p>{this.props.text}</p>
    )
  }
}


function SettingsPanel() {
  return (
    <div style={SettingsPanelStyle}>
      <ControlLabel text="Principal point" />
      <Dropdown items={["Default", "Manual", "From third vanishing point"]} />
      <ControlLabel text="Vanishing point axes" />
      <Dropdown items={["x", "y", "z"]} />
      <Dropdown items={["x", "y", "z"]} />
    </div>
  )
}



const ResultPanel = () => {
  return (
    <div style={SidePanelStyle}>
      <h1>Result</h1>
    </div>
  )
}






const AppStyle: React.CSSProperties = {
  userSelect: "none",
  display: "flex",
  alignItems: "stretch"
}

class App extends React.Component {
  render() {
    return (
      <div style={ AppStyle }>
        <SettingsPanel />
        <ImageContainer />
        <ResultPanel />
      </div>
    );
  }
}

export default App;
