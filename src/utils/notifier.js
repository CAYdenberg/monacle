var EE = require('event-emitter');

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
  },
  addedToFolder: {
    type: 'success',
    message: 'Paper successfully saved to folder',
    autodismiss: true
  }
};

function Notifier() {
  EE.call(this);
  this.notifications = [];
}

Notifier.prototype = Object.create(EE.prototype);

notifier.prototype.create = function(alertName, payload) {
  var notification = new Notification(alertName, payload);
  this.notifications.push(notification);
  this.emit('NOTIFICATION');
  if ( notification.alert.autodismiss ) {
    setTimeout(function() {
      notification.dismiss();
    }, 3000);
  }
  return notification;
}

var notifier = new Notifier();

function Notification(alertName, payload) {
  this.alert = alerts[alertName];
  this.payload = payload;
}

Notification.prototype.dismiss = function() {
  notifier.notifications.splice(notifier.notifications.indexOf(this), 1);
  this.emit('NOTIFICATION');
}

module.exports = new Notifier();
