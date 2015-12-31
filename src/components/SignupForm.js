var React = require('react');
var validateEmail = require('validate-email');

var utils = require('../utils');
var dispatcher = utils.dispatcher;
var createTypingCallback = utils.createTypingCallback;

var ErrorMsg = require('./partials/ErrorMsg.js');

var store = null;

var SignupForm = React.createClass({
  getInitialState: function() {
    store = this.props.store;
    return ({
      email: '',
      password1: '',
      password2: '',
      emailErr: '',
      password1Err: '',
      password2Err: '',
      waiting: false
    });
  },

  componentWillMount: function() {
    store.onError(function() {
      this.setState({
        loginError: store.loginError,
        waiting: false
      })
    }.bind(this));
    store.onUpdate(function() {
      //return to initial state
      this.replaceState(this.getInitialState());
    }.bind(this));
  },

  //validation functions
  isEmailValid: function() {
    if ( ! this.state.email ) {
      this.setState({emailErr: 'Email address is required'});
      return false;
    }
    else if ( ! validateEmail(this.state.email) ) {
      this.setState({emailErr: 'Email address is not valid'});
      return false;
    } else {
      this.setState({emailErr: ''});
      return true;
    }
  },

  isPasswordValid: function() {
    if ( ! this.state.password1 ) {
      this.setState({password1Err: 'Password is required'});
      return false;
    } else {
      this.setState({password1Err: ''});
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
      this.setState({password2Err: 'Passwords do not match'});
      return false;
    }
  },

  submit: function(e) {
    e.preventDefault();
    //check that passwords match
    if (this.isEmailValid() && this.isPasswordValid() && this.checkPasswordsMatch()) {
      this.setState({
        waiting: true
      });
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
      var setStateArgs = {};
      setStateArgs[stateKeyToReset] = '';
      o.setState(setStateArgs);
    }
  },

  emailBlur: function() {
    this.isEmailValid();
  },

  password1Blur: function() {
    this.isPasswordValid();
  },

  password2Blur: function() {
    this.checkPasswordsMatch();
  },

  render: function() {
    return (
      <form className={this.state.waiting ? 'waiting' : ''}>
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
        <ErrorMsg message={this.state.loginError} type="danger" />
        <div className="form-group">
          <button className="btn btn-success" onClick={this.submit}>Submit</button>
        </div>
      </form>
    )
  }
});

module.exports = SignupForm;
