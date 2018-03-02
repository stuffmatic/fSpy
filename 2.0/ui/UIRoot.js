/** @jsx React.DOM */

var UIRoot = React.createClass({
  render: function() {
    return (
      <div>
        <ImageCanvas />
      </div>
    );
  }
});

React.renderComponent(
  <div>
    <Header />
    <ImageCanvas />
    <SettingsSection />
    <ResultSection />
    <Footer />
  </div>,
  document.getElementById('content')
);