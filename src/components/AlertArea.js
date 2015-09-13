var React = require('react');
var _ = require('underscore');

var emitter = require('../utils').emitter;
var dispatcher = require('../utils').dispatcher;

module.exports = function(store) {

  var AlertArea = React.createClass({
    getInitialState: function() {
      return ({
        alerts: []
      })
    },
    componentWillMount: function() {
      emitter.on('NOTIFICATION', function() {
        this.setState({
          alerts: store
        });
      }.bind(this));
    },
    render: function() {
      return (
        <div>
          {
            this.state.alerts.map(function(item, index) {
              <Alert item={item} key={index} />
            });
          }
        </div>
      )
    }
  });

  var Alert = React.createClass({
    retry: function() {
      dispatcher.dispatch(this.props.item.payload);
    },
    render: function() {
      return (
        <div className="alert alert-"+{this.props.item.alert.type} role="alert">
          {this.props.item.alert.message}
          {if (this.props.item.payload) {
            <a onClick={this.retry}>Retry</a>
          }}
        </div>
      )
    }
  });

  return AlertArea;
}
