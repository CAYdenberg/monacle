var React = require('react');

const utils = require('../utils');
const createTypingCallback = utils.createTypingCallback;

const ErrorMsg = require(process.env.ROOT+'/components/partials/ErrorMsg.js');

var store = null;

const SigninForm = React.createClass({
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
      <div class="modal fade" id="modal-signin-form">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h3 class="modal-title">Sign in</h3>
            </div>

            <div class="modal-body" id="signin-form-wrapper">

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

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal" data-toggle="modal" data-target="#modal-signup-form">
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = SigninForm;
