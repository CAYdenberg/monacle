var _ = require('underscore');
var utils = require('../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var popsicle = require('popsicle');

function UserStore(userEmail) {

  this.apiUrlBase = '/user/';

  //set up
  this.update(userEmail);

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'LOG_IN':
        this.login(payload.content.email, payload.content.password);
        break;

      case 'LOG_OUT':
        this.logout();
        break;

      default:
        break;
    }
  }.bind(this));

}

UserStore.prototype.update = function(email) {
  if (email.length) {
    this.userEmail = email;
    this.loggedIn = true;
  } else {
    this.userEmail = '';
    this.loggedIn = false;
  }
}

UserStore.prototype.login = function(email, password) {
  var o = this;
  popsicle({
    method: 'POST',
    body: {email: email, password: password},
    url: o.apiUrlBase + 'signin/'
  }).then(function(res) {
    o.update(res.body.email);
    emitter.emit('USER_CHANGE');
    emitter.emit('CLOSE_MODALS');
  });
}

UserStore.prototype.logout = function() {
  var o = this;
  popsicle({
    method: 'GET',
    url: o.apiUrlBase + '/logout/'
  }).then(function(res) {
    o.update(res.body.email);
    emitter.emit('USER_CHANGE');
  });
}

module.exports = function(user) {
  return new UserStore(user);
}
