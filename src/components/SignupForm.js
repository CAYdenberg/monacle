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
      if ( ! this.state.email ) {
        this.setState({ emailErr: 'Email address is required' });
        return false;
      }
      else if ( ! validateEmail(this.state.email) ) {
        this.setState({ emailErr: 'Email address is not valid' });
        return false;
      } else {
        this.setState({ emailErr: '' });
        return true;
      }
    },

    isEmailUnique: function() {
      var o = this;
      popsicle({
        method: 'GET',
        url: '/user/exists/'+encodeURIComponent(this.state.email)
      }).then(function(res) {
        if (res.body.userExists) {
          o.setState({ emailErr: 'This account already exists' });
        } else {
          o.setState({ emailErr: '' });
        }
      });
    },

    isPasswordValid: function() {
      if ( ! this.state.password1 ) {
        this.setState({ password1Err: 'Password is required' });
        return false;
      } else {
        this.setState({ password1Err: '' });
        return true;
      }
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
      if (this.isEmailValid() && this.isPasswordValid() && this.checkPasswordsMatch()) {
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

    emailBlur: function() {
      if ( this.isEmailValid() )
        this.isEmailUnique();
    },

    password1Blur: function() {
      this.isPasswordValid();
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
              onBlur={this.emailBlur}
            />
            <ErrorMsg message={this.state.emailErr} type="warning" />
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
