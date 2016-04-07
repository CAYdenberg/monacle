const React = require('react');
const dispatcher = require(process.env.ROOT+'/lib').dispatcher;

var store = require(process.env.ROOT+'/stores/userStore');

const SigninForm = require(process.env.ROOT+'/components/Nav/Account/SigninForm');
const SignupForm = require(process.env.ROOT+'/components/Nav/Account/SignupForm');

/**
 * Account area. This either renders the links to open modals for sign-in/sign-up,
 * or a dropdown headed by the users name. (With options for profile and logging out).
 * Rendered at #account-area.
 * Should be bound with the userStore.
 */
module.exports = React.createClass({
  getInitialState: function() {
    store = this.props.store;
    return ({
      loggedIn : store.loggedIn,
      currentUser : store.userEmail
    })
  },

  componentWillMount: function() {
    store.onUpdate(function() {
      this.setState({
        loggedIn: store.loggedIn,
        currentUser: store.userEmail
      });
    }.bind(this));
  },

  logout: function(e) {
    e.preventDefault();
    dispatcher.dispatch({type: 'LOG_OUT'});
  },

  render: function() {
    if (this.state.loggedIn) {
      return (
        <ul className="horizontal-list">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">{this.state.currentUser}</a>
            <ul className="dropdown-menu navmenu-nav" role="menu">
              <li><a href="/profile/">Profile</a></li>
              <li><a href="/users/logout/" onClick={this.logout}>Logout</a></li>
            </ul>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="horizontal-list">
          <li><a href="#" data-toggle="modal" data-target="#modal-signin-form">Sign-in</a>
            <SigninForm />
          </li>
          <li><a href="#" data-toggle="modal" data-target="#modal-signup-form">Create an account</a>
            <SignupForm />
          </li>
        </ul>
      )
    }
  }
});
