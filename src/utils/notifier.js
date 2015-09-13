var React = require('react');
var emitter = require('./index.js').emitter;

var alerts = {
  loginFailed: {
    type: 'warning',
    message: 'Your username and password do not match'
  },
  lostPubmed: {
    type: 'danger',
    message: 'Unable to reach PubMed server at this time.',
    retry: true
  },
  lostBackend: {
    type: 'danger',
    message: 'Unable to reach Monocle',
    retry: true
  }
};


function Notification(alertName, payload) {
  this.alert = alerts[alertName];
  this.payload = payload;
  emitter.emit('NOTIFICATION');
}

Notification.prototype.dismiss = function() {
  notifier.splice(notifier.indexOf(this), 1);
  emitter.emit('NOTIFICATION');
}

function Notifier() {}

Notifier.prototype = Object.create(Array.prototype);

Notifier.prototype.create = function() {
  var notification = new Notification(arguments);
  this.push(notification);
  return notification;
}

module.exports = function() {
  return new Notifier();
}
