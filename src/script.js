/** @jsx React.DOM */

var ncbi = require('../lib/ncbi-eutils/actions.js');
var React = require('react');
var components = require('./components.js');

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
  var query_string = getParameterByName("query");
  var call = ncbi.pubmedSearch(
    function(results) { console.log(results) },
    query_string
  );
  React.render(<components.Citation/>, document.getElementById('citations'));
});
