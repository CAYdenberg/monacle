var React = require('react');

var emitter;

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
}

Notification.prototype.dismiss = function() {
  notifier.splice(notifier.indexOf(this), 1);
  emitter.emit('NOTIFICATION');
}


function Notifier() {
  this.notifications = [];
}

Notifier.prototype.create = function(alertName, payload) {
  var notification = new Notification(alertName, payload);
  this.notifications.push(notification);
  emitter.emit('NOTIFICATION');
  return notification;
}

module.exports = function(appEmitter) {
  emitter = appEmitter;
  return new Notifier();
}
