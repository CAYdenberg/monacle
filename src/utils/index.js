var flux = require('flux');
var EE = require('event-emitter');
var _ = require('underscore');

var emitter = new EE();
var notifier = require('./notifier')(emitter);

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
    stateDef = {};
    stateDef[stateDefKey] = e.target.value;
    reactClass.setState(stateDef);
  };
}

module.exports = {
  dispatcher : new flux.Dispatcher(),
  emitter : emitter,
  notifier : notifier,
  formatAuthorList : formatAuthorList,
  formatYear : formatYear,
  createTypingCallback : createTypingCallback
};
