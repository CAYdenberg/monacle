/** @jsx React.DOM */

var React = require('react');
var dispatcher = require('./utils.js').dispatcher;
var CitationList = require('./components/CitationList.js');

//get GET variable by name
// got from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function() {
  //on page load, get GET variable "query"
  React.render(<CitationList />, document.getElementById('citations'));
  dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : getParameterByName("query") } });
});
