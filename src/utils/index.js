var flux = require('flux');
var EE = require('event-emitter');
var _ = require('underscore');

var notifier = require('./notifier')();

var getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var formatAuthorList = function(authors) {
  var authArr,
    authStr = '';
  if (authors) {
    authArr = _.map(authors, function(author) {
      return author.name;
    });
    authStr = authArr.join(', ');
  }
  return authStr;
}

var formatYear = function(pubdate) {
  return pubdate.substring(0, 4);
}

module.exports = {
  dispatcher : new flux.Dispatcher(),
  emitter : new EE(),
  getParameterByName : getParameterByName,
  formatAuthorList : formatAuthorList,
  formatYear : formatYear,
  notifier : notifier
};
