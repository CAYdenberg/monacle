const React = require('react');

const lib = require(process.env.ROOT+'/lib');
const dispatcher = lib.dispatcher;
const createTypingCallback = lib.createTypingCallback;

var ErrorMsg = require(process.env.ROOT+'/components/partials/ErrorMsg.js');

const store = require(process.env.ROOT+'/stores/userStore');

module.exports = React.createClass({
  getInitialState: function() {
    return ({
      email: '',
      password: '',
      loginError: '',
      waiting: false
    });
  },

  componentWillMount: function() {
    store.onError(() => {
      this.setState({
        loginError: store.loginError,
        waiting: false
      })
    });
    store.onUpdate(() => {
      //return to initial state
      this.replaceState(this.getInitialState());
    });
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
      
      <div className="modal fade" id="modal-signup-form">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h3 className="modal-title">Sign up now!</h3>
            </div>
            <div className="modal-body">

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
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" data-toggle="modal" data-target="#modal-signin-form">
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </div>

    )
  }
});
