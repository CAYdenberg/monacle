const popsicle = require('popsicle');

const emitter = require('event-emitter')({});

const lib = require('../lib');
const dispatcher = lib.dispatcher;

var userStore = {

  apiUrlBase: '/user/',

  loginError: '',

  userEmail: null,

  onUpdate: function(callback) {
    emitter.on('UPDATE', callback);
  },

  onError: function(callback) {
    emitter.on('ERROR', callback);
  },

  update: function(email) {
    this.createUserError = false;
    this.loginError = false;
    if (email && email.length) {
      this.userEmail = email;
    } else {
      this.userEmail = null;
    }
    emitter.emit('UPDATE');
  },

  login: function(email, password) {
    popsicle({
      method: 'POST',
      body: {email: email, password: password},
      url: userStore.apiUrlBase + 'signin/'
    }).then((res) => {
      if (res.status === 200) {
        this.update(res.body.email);
      } else {
        this.loginError = "Email address and password do not match";
        emitter.emit('ERROR');
      }
    });
  },

  create: function(email, password) {
    popsicle({
      method: 'POST',
      body: {email: email, password: password},
      url: userStore.apiUrlBase + 'signup/'
    }).then((res) => {
      if (res.status === 200) {
        this.update(res.body.email);
      } else {
        //create an error
      }
    });
  },

  logout: function() {
    popsicle({
      method: 'GET',
      url: userStore.apiUrlBase + '/logout/'
    }).then((res) => {
      this.update(res.body.email);
    });
  }

}

dispatcher.register((payload) => {
  switch (payload.type) {
    case 'LOG_IN':
      userStore.login(payload.content.email, payload.content.password);
      break;

    case 'LOG_OUT':
      userStore.logout();
      break;

    case 'CREATE_USER':
      userStore.create(payload.content.email, payload.content.password);
      break;

    default:
      break;
  }
});

module.exports = userStore;
