var flux = require('flux');
var EE = require('event-emitter');

var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

module.exports = {
  dispatcher : new flux.Dispatcher(),
  emitter : new EE(),
  getParameterByName : getParameterByName
};
