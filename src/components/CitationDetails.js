var _ = require('underscore');
var React = require('react');

var utils = require('../utils.js'),
  dispatcher = utils.dispatcher;
  emitter = utils.emitter;

module.exports = React.createClass({
  render: function() {
    if ( _.isNull(this.props.data.abstract) ) {
      return (
        <div className="progressBar">Progress bar</div>
      )
    } else {
      return (
        <div className="abstract">{this.props.data.abstract}</div>
      )
    }
  }
});
