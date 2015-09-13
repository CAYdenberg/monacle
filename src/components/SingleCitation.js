var React = require('react');
var _ = require('underscore');

var utils = require('../utils');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {

  var SingleCitation = React.createClass({
    getInitialState: function() {
      return {
        data : this.props.data
      }
    },
    citationsUpdated: function() {
      this.setState({ data : store.getItem(this.props.data.pubmed) });
    },
    componentWillMount: function() {
      emitter.on('CITATIONS_UPDATED', this.citationsUpdated);
    },
    componentWillUnmount: function() {
      emitter.off('CITATIONS_UPDATED', this.citationsUpdated);
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
