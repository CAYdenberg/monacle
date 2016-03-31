var flux = require('flux');
var _ = require('underscore');

var dispatcher = new flux.Dispatcher();

var notifier = require('./notifier')(dispatcher);

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

var createTypingCallback = function(stateDefKey, reactClass) {
  return function(e) {
    var stateDef = {};
    stateDef[stateDefKey] = e.target.value;
    reactClass.setState(stateDef);
  };
}

module.exports = {
  dispatcher : dispatcher,
  notifier : notifier,
  formatAuthorList : formatAuthorList,
  formatYear : formatYear,
  createTypingCallback : createTypingCallback
};
