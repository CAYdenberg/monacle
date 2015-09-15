var React = require('react');
var _ = require('underscore');
var popsicle = require('popsicle');
var validateEmail = require('validate-email');

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
        password1Err: '',
        password2Err: ''
      });
    },

    //validation functions
    isEmailValid: function() {
      if (validateEmail(this.state.email)) {

      }
    },
    isPasswordValid: function() {

    },
    checkPasswordsMatch: function() {
      var password1 = this.state.password1;
      var password2 = this.state.password2;
      //replace with more complex validation later
      if ( password1 === password2 ) {
        this.setState({ password2Err: '' });
        return true;
      } else {
        this.setState({ password2Err: 'Passwords do not match' });
        return false;
      }
    },

    submit: function(e) {
      e.preventDefault();
      //check that passwords match
      if ( this.checkPasswordsMatch() ) {
        dispatcher.dispatch({
          type: 'CREATE_USER',
          content: {
            email: this.state.email,
            password: this.state.password1
          }
        });
      }
    },

    reset: function(stateKeyToReset) {
      var o = this;
      return function() {
        setStateArgs = {};
        setStateArgs[stateKeyToReset] = '';
        o.setState(setStateArgs);
      }
    },
    password2Blur: function() {
      this.checkPasswordsMatch();
    },

    render: function() {
      return (
        <form>
          <div className="form-group">
            <label htmlFor="su-email">Email address</label>
            <input type="email" className="form-control" id="su-email" name="email" value={this.state.email}
              onChange={createTypingCallback('email', this)}
              onFocus={this.reset('emailErr')}
              onBlur={this.checkEmail}
            />
            <ErrorMsg message={this.state.emailError} type="warning" />
          </div>
          <div className="form-group">
            <label htmlFor="su-password">Password</label>
            <input type="password" className="form-control" id="su-password" name="password" value={this.state.password1}
              onFocus={this.reset('password1Err')}
              onBlur={this.password1Blur}
              onChange={createTypingCallback('password1', this)}
            />
            <ErrorMsg message={this.state.password1Err} type="warning" />
          </div>
          <div className="form-group">
            <label htmlFor="su-password-2">Repeat Password</label>
            <input type="password" className="form-control" id="su-password-2" name="password-2" value={this.state.password2}
              onFocus={this.reset('password2Err')}
              onBlur={this.password2Blur}
              onChange={createTypingCallback('password2', this)}
            />
            <ErrorMsg message={this.state.password2Err} type="warning" />
          </div>
          <input type="submit" value="Submit" className="btn btn-success"
            onClick={this.submit}
          />
        </form>
      )
    }
  });

  var ErrorMsg = require('./partials/ErrorMsg.js')();

  return SignupForm;
}
