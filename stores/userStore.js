const emitter = require('event-emitter')({});


const UserStore = {

  APIURLBASE: '/user/',

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

  setLoginError: function(message) {
    this.loginError = message;
    emitter.emit('ERROR');
  }

}

module.exports = () => {
  return Object.assign(Object.create(UserStore), {
    loginError: null,
    userEmail: null
  });
}
