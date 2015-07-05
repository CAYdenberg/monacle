var EventEmitter = require('event-emitter');

//create common event emitter for the app
var events = new EventEmitter();

//a comment
module.exports = {
  events : events
}
