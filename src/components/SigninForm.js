var React = require('react');
var _ = require('underscore');
var popsicle = require('popsicle');

var dispatcher = require('../utils').dispatcher;

module.exports = function(store) {

  var SigninForm = React.createClass({
    getInitialState: function() {
      return ({
        email: '',
        password: ''
      });
    },
    submit: function(e) {
      e.preventDefault();
      dispatcher.dispatch({
        type: 'LOG_IN',
        content: {
          email: this.state.email,
          password: this.state.password
        }
      });
    },
    typingEmail: function(e) {
      this.setState({ email: e.target.value });
    },
    typingPassword: function(e) {
      this.setState({ password: e.target.value });
    },
    render: function() {
      return (
        <form>
          <div className="form-group">
            <label htmlFor="si-email">Email address</label>
            <input type="email" className="form-control" id="si-email" name="email" value={this.state.email} onChange={this.typingEmail} />
          </div>
          <div className="form-group">
            <label htmlFor="si-password">Password</label>
            <input type="password" className="form-control" id="si-password" name="password" value={this.state.password} onChange={this.typingPassword} />
          </div>
          <button className="btn btn-success" onClick={this.submit}>Submit</button>
        </form>
      )
    }
  });

  return SigninForm;
}
