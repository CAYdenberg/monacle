var React = require('react');
var _ = require('underscore');
var popsicle = require('popsicle');

var utils = require('../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;
var createTypingCallback = utils.createTypingCallback;

module.exports = function(store) {

  var SigninForm = React.createClass({
    getInitialState: function() {
      return ({
        email: '',
        password: '',
        loginError: '',
        waiting: false
      });
    },

    componentWillMount: function() {
      emitter.on('ERR_LOGIN', function() {
        this.setState({
          loginError: store.loginError,
          waiting: false
        })
      }.bind(this));
      emitter.on('CLOSE_MODALS', function() {
        this.setState({
          waiting: false
        })
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

  var ErrorMsg = require('./partials/ErrorMsg.js')();

  return SigninForm;
}
