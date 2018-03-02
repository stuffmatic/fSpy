/** @jsx React.DOM */

var SettingsSection = React.createClass({
  render: function() {
    return (
      <div className="section" id="settings-section">
          <h2 className="section-header">Settings</h2>
            <AxisSelectButton />
            <AxisSelectButton />
            <AxisSelectButton />
      </div>
    );
  }
});