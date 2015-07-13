var flux = require('flux');
var EE = require('event-emitter');

module.exports = {
  dispatcher : new flux.Dispatcher(),
  emitter : new EE()
};
