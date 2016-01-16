var React = require('react');
var dispatcher = require('../utils').dispatcher;

var store = null;

/**
 * Account area. This either renders the links to open modals for sign-in/sign-up,
 * or a dropdown headed by the users name. (With options for profile and logging out).
 * Rendered at #account-area.
 * Should be bound with the userStore.
 */
var AccountArea = React.createClass({
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
          <li><a href="#" data-toggle="modal" data-target="#modal-signin-form">Sign-in</a></li>
          <li><a href="#" data-toggle="modal" data-target="#modal-signup-form">Create an account</a></li>
        </ul>
      )
    }
  }
});

module.exports = AccountArea;
