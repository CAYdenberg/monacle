var React = require('react');

module.exports = function(store) {

  var ProgressBar = React.createClass({
    render: function() {
      return (
        <div className="progress-bar progress-bar-striped active"></div>
      )
    }
  });

  return ProgressBar;
}
