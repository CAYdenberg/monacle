var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {

  var CitationDetails = React.createClass({

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

  return CitationDetails;
}
