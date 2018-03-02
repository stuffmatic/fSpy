/** @jsx React.DOM */

var ResultSection = React.createClass({
  render: function() {
    return (
      <div className="section"  id="result-section">
          <h2 className="section-header">Calibration result</h2>
          <ResultPanel></ResultPanel>
          <ResultPanel></ResultPanel>
          <ResultPanel></ResultPanel>
          <ResultPanel></ResultPanel>
          <ResultPanel></ResultPanel>
          <ResultPanel></ResultPanel>
      </div>
    );
  }
});