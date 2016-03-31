var React = require('react');

var utils = require('../utils');
var dispatcher = utils.dispatcher;
var createTypingCallback = utils.createTypingCallback;

var ErrorMsg = require('./partials/ErrorMsg.js');

var store = null;

var SigninForm = React.createClass({
  getInitialState: function() {
    store = this.props.store;
    return ({
      email: '',
      password: '',
      loginError: '',
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

  submit: function(e) {
    e.preventDefault();
    this.setState({
      waiting: true
    });
    dispatcher.dispatch({
      type: 'LOG_IN',
      content: {
        email: this.state.email,
        password: this.state.password
      }
    });
  },

  render: function() {
    return (
      <form className={this.state.waiting ? 'waiting' : ''}>
        <div className="form-group">
          <label htmlFor="si-email">Email address</label>
          <input type="email" className="form-control" id="si-email" name="email" value={this.state.email} onChange={createTypingCallback('email', this)} />
        </div>
        <div className="form-group">
          <label htmlFor="si-password">Password</label>
          <input type="password" className="form-control" id="si-password" name="password" value={this.state.password} onChange={createTypingCallback('password', this)} />
        </div>
        <div className="form-group">
          <button className="btn btn-success" onClick={this.submit}>Submit</button>
        </div>
        <ErrorMsg message={this.state.loginError} type="danger" />
      </form>
    )
  }
});

module.exports = SigninForm;
