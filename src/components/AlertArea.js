var React = require('react');
var _ = require('underscore');

var utils = require('../utils');
var emitter = utils.emitter;
var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

module.exports = function() {

  var NotificationArea = React.createClass({
    getInitialState: function() {
      return ({
        notifications: []
      })
    },
    componentWillMount: function() {
      emitter.on('NOTIFICATION', function() {
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
    retry: function() {
      dispatcher.dispatch(this.props.item.payload);
    },
    dismiss: function() {
      this.props.item.dismiss();
    },
    render: function() {
      return (
        <div className={"alert alert-"+this.props.item.alert.type} role="alert">
          <button type="button" className="close" aria-label="Close" onClick={this.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.item.alert.message}
          {this.props.item.payload ? '<a onClick='+this.retry+'>Retry</a>' : ''}
          &nbsp; &nbsp;
        </div>
      )
    }
  });

  return NotificationArea;
}
