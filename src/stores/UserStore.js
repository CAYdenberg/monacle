var _ = require('underscore');
var utils = require('../utils.js');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var popsicle = require('popsicle');

function UserStore(userEmail) {

  this.apiUrlBase = '/user/';

  //set up
  if (userEmail) {
    this.userEmail = userEmail;
    this.loggedIn = true;
  } else {
    this.userEmail = '';
    this.loggedIn = false;
  }

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

UserStore.prototype.login = function(email, password) {
  var o = this;
  popsicle({
    method: 'POST',
    body: {email: email, password: password},
    url: o.apiUrlBase + 'signin/'
  }).then(function(res) {
    console.log(res);
  });
}

module.exports = UserStore;
