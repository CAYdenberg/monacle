var React = require('react');
var _ = require('underscore');
var popsicle = require('popsicle');

var utils = require('../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;
var createTypingCallback = utils.createTypingCallback;

module.exports = function(store) {

  var SignupForm = React.createClass({
    getInitialState: function() {
      return ({
        email: '',
        password1: '',
        password2: '',
        emailErr: '',
        passwordErr: ''
      });
    },
    submit: function(e) {
      e.preventDefault();
      //check that passwords match
      dispatcher.dispatch({
        type: 'CREATE_USER',
        content: {
          email: this.state.email,
          password: this.state.password
        }
      });
    },
    render: function() {
      return (
        <form method="POST" action="/user/signup/">
          <div className="form-group">
            <label htmlFor="su-email">Email address</label>
            <input type="email" className="form-control" id="su-email" name="email" onChange={createTypingCallback('email', this)} />
            <ErrorMsg message={this.state.emailError} type="warning" />
          </div>
          <div className="form-group">
            <label htmlFor="su-password">Password</label>
            <input type="password" className="form-control" id="su-password" name="password" onChange={createTypingCallback('password', this)} />
          </div>
          <div className="form-group">
            <label htmlFor="su-password-2">Repeat Password</label>
            <input type="password" className="form-control" id="su-password-2" name="password-2" onChange={createTypingCallback('password2', this)} />
            <ErrorMsg message={this.state.passwordError} type="warning" />
          </div>
          <input type="submit" value="Submit" className="btn btn-success" />
        </form>
      )
    }
  });

  var ErrorMsg = require('./partials/ErrorMsg.js')();

  return SignupForm;
}
