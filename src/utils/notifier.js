var _ = require('underscore');
var EE = require('event-emitter');

var emitter = EE({});

function Notifier(dispatcher) {
  this.dispatcher = dispatcher;
  this.notifications = [];
}

/**
 * Create a notification by calling notifier.create({object literal})
 *
 * Notifications can have any properties but typically include:
 * message - message displayed to user
 * class - BS Alert class (success, info, warning, danger)
 * payload - a Dispatcher payload which can be re-sent to the dispatcher by calling
 * notifcation.retry()
 * autodismiss - Boolean whether to dismiss the notification after 3 sec
 *
 * Notifications have two methods:
 * dismiss (removes the notification from the Notifier)
 * retry (sends the notifications payload to the dispatcher)
 *
 * This Notifier.create returns the notification so these methods can be called
 */
Notifier.prototype.create = function(settings) {
  var defaults = {
    message: '',
    class: 'danger',
    payload: false,
    autodismiss: false
  }
  var notification = _.extend(defaults, settings);
  var notifier = this;

  //append dismiss method
  notification.dismiss = function() {
    notifier.notifications.splice(notifier.notifications.indexOf(this), 1);
    emitter.emit('UPDATE');
  }.bind(notification);

  //append retry method
  notification.retry = function() {
    console.log(this);
    if (notification.payload) {
      notifier.dispatcher.dispatch(this.payload);
      this.dismiss();
    }
  }.bind(notification);

  this.notifications.push(notification);
  emitter.emit('UPDATE');

  //dismiss after 3 sec if autodismiss is true
  if (notification.autodismiss) {
    setTimeout(function() {
      notification.dismiss();
    }, 3000);
  }


  console.log(notification);
  return notification;
}

Notifier.prototype.onUpdate = function(callback) {
  emitter.on('UPDATE', callback);
}

module.exports = function(dispatcher) {
  return new Notifier(dispatcher);
}
