/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils.js')

var CitationStore = require('./stores/CitationStore.js');
var store = new CitationStore();
var CitationList = require('./components/CitationList.js')(store);

$(document).ready(function() {
  //on page load, get GET variable "query"
  React.render(<CitationList />, document.getElementById('citations'));
  utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
});
