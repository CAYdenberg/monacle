var React = require('react');
var notifier = require('../utils').notifier;

var NotificationArea = React.createClass({
  getInitialState: function() {
    return ({
      notifications: []
    })
  },
  componentWillMount: function() {
    notifier.onUpdate(function() {
      this.setState({
        notifications: notifier.notifications
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        {
          this.state.notifications.map(function(item, index) {
            return (<Notification item={item} key={index} />)
          })
        }
      </div>
    )
  }
});

var Notification = React.createClass({
  render: function() {
    return (
      <div className={"alert alert-"+this.props.item.class} role="alert">
        <button type="button" className="close" aria-label="Close" onClick={this.props.item.dismiss}>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.props.item.message}
        &nbsp;
        <Retry item={this.props.item} />
        &nbsp; &nbsp;
      </div>
    )
  }
});

var Retry = React.createClass({
  render: function() {
    if (this.props.item.payload) {
      return (
        <a href="#" onClick={this.props.item.retry}>Retry</a>
      )
    } else {
      return (<span />)
    }
  }
});

module.exports = NotificationArea;
