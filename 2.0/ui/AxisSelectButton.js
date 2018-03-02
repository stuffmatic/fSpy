/** @jsx React.DOM */

var AxisSelectButton = React.createClass({
  render: function() {
    return (
        <div className="axis-select-button">
          <span>1</span>
          <a className="button axis-bg-x" href="#">x-</a>
          <a className="button axis-bg-x" href="#">x+</a>
          <a className="button axis-bg-y" href="#">y-</a>
          <a className="button axis-bg-y" href="#">y+</a>
          <a className="button axis-bg-z" href="#">z-</a>
          <a className="button axis-bg-z" href="#">z+</a>
        </div>
    );
  }
});