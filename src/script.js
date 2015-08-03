/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils.js')
var CitationList = require('./components/CitationList.js');

$(document).ready(function() {
  //on page load, get GET variable "query"
  React.render(<CitationList />, document.getElementById('citations'));
  utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
});
