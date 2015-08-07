var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {

  var SingleCitation = React.createClass({
    getInitialState: function() {
      return {
        data : this.props.data
      }
    },
    componentWillMount: function() {
      emitter.on('CITATIONS_UPDATED', function() {
        this.setState({ data : store.getItem(this.props.data.pubmed) });
      }.bind(this));
    },
    render: function() {
      return (
        <CitationDetails data={this.state.data} />
      )
    }
  });

  var CitationDetails = require('./CitationDetails.js')(store);

  return SingleCitation;
}
