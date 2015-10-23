var React = require('react');
var _ = require('underscore');
var emitter = require('../utils').emitter;
var dispatcher = require('../utils').dispatcher;

module.exports = function(store) {

  var AccountArea = React.createClass({
    getInitialState: function() {
      return ({
        loggedIn : store.loggedIn,
        currentUser : store.userEmail
      })
    },
    componentWillMount: function() {
      emitter.on('USER_CHANGE', function() {
        this.setState({
          loggedIn: store.loggedIn,
          currentUser: store.userEmail
        });
      }.bind(this));
    },
    logout: function(e) {
      e.preventDefault();
      dispatcher.dispatch({ type: 'LOG_OUT' });
    },
    render: function() {
      if (this.state.loggedIn) {
        return (
          <ul className="horizontal-list">
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">{this.state.currentUser}</a>
              <ul className="dropdown-menu navmenu-nav" role="menu">
                <li><a href="#">Profile</a></li>
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

  return AccountArea;
}
