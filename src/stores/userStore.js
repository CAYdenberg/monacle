var utils = require('../utils');
var EE = require('event-emitter');
var popsicle = require('popsicle');

var dispatcher = utils.dispatcher;

function UserStore() {
  EE.call(this);

  this.apiUrlBase = '/user/';

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'LOG_IN':
        this.login(payload.content.email, payload.content.password);
        break;

      case 'LOG_OUT':
        this.logout();
        break;

      case 'CREATE_USER':
        this.create(payload.content.email, payload.content.password);
        break;

      default:
        break;
    }
  }.bind(this));
}

UserStore.prototype = Object.create(EE.prototype);

UserStore.prototype.update = function(email) {
  this.createUserError = false;
  this.loginError = false;
  if (email.length) {
    this.userEmail = email;
    this.loggedIn = true;
  } else {
    this.userEmail = '';
    this.loggedIn = false;
  }
  this.emit('USER_CHANGE');
  this.emit('CLOSE_MODALS');
}

UserStore.prototype.login = function(email, password) {
  var o = this;
  popsicle({
    method: 'POST',
    body: {email: email, password: password},
    url: o.apiUrlBase + 'signin/'
  }).then(function(res) {
    if (res.status === 200) {
      o.update(res.body.email);
    } else {
      o.loginError = "Email address and password do not match";
      this.emit('ERR_LOGIN');
    }
  });
}

UserStore.prototype.create = function(email, password) {
  var o = this;
  popsicle({
    method: 'POST',
    body: {email: email, password: password},
    url: o.apiUrlBase + 'signup/'
  }).then(function(res) {
    if (res.status === 200) {
      o.update(res.body.email);
    } else {
      //create an error
    }
  });
}

UserStore.prototype.logout = function() {
  var o = this;
  popsicle({
    method: 'GET',
    url: o.apiUrlBase + '/logout/'
  }).then(function(res) {
    o.update(res.body.email);
  });
}

module.exports = new UserStore();
