const React = require('react');
const notifier = require(process.env.ROOT+'/lib').notifier;

const NotificationArea = React.createClass({
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

const Notification = React.createClass({
  dismiss: function(e) {
    e.preventDefault();
    this.props.item.dismiss();
  },
  render: function() {
    return (
      <div className={"alert alert-"+this.props.item.class} role="alert">
        <button type="button" className="close" aria-label="Close" onClick={this.dismiss}>
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

const Retry = React.createClass({
  retry: function(e) {
    e.preventDefault();
    this.props.item.retry();
  },
  render: function() {
    if (this.props.item.payload) {
      return (
        <a href="#" onClick={this.retry}>Retry</a>
      )
    } else {
      return (<span />)
    }
  }
});

module.exports = NotificationArea;
