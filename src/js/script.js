//javascript document

var Eutils = require('../../lib/ncbi-eutils/Eutils.js');

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
  var call = new Eutils({
    method : 'esearch',
    params : {
      query : 'ydenberg ca'
    }
  });
  call.send();
});
