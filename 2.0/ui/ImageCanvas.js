/** @jsx React.DOM */

var ImageCanvas = React.createClass({
  render: function() {
    return (
      <div id="image-canvas-container">
          <ImageCanvasOverlay />
          <canvas id="image-canvas">
              OH NOEZ! NO CANVAS!
          </canvas>
      </div>
    );
  }
});