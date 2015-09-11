var React = require('react');
var _ = require('underscore');

module.exports = function(store) {

  var AccountArea = React.createClass({
    getInitialState: function() {
      return ({
        loggedIn : store.loggedIn,
        currentUser : store.userEmail
      })
    },
    render: function() {
      if (this.state.loggedIn) {
        return (
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">{this.props.currentUser}</a>
            <ul className="dropdown-menu navmenu-nav" role="menu">
              <li><a href="#">Profile</a></li>
              <li><a href="#">Logout</a></li>
            </ul>
          </li>
        )
      } else {
        return (
          <li>
            <a href="#" data-toggle="modal" data-target="#modal-signin-form">Sign-in</a>
            /
            <a href="#" data-toggle="modal" data-target="#modal-signup-form">Create an account</a>
          </li>
        )
      }
    }
  });

  return AccountArea;
}
