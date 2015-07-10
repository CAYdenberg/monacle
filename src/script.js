/** @jsx React.DOM */

var React = require('react');
var Dispatcher = require('./Dispatcher.js')

var components = require('./components.js');
var stores = require('./stores.js');


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
  Dispatcher.dispatch({ type : 'search', content : { queryString : getParameterByName("query") } });
  React.render(<components.Citations />, document.getElementById('citations'));
});
