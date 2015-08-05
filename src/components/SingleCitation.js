var React = require('react');
var _ = require('underscore');

var utils = require('../utils.js');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;

module.exports = function(store) {

  var SingleCitation = React.createClass({

  });

  var CitationDetails = require('./CitationDetails.js')();

  return SingleCitation;
}
