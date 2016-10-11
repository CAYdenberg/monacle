var React = require('react');

var ErrorMsg = React.createClass({
  render: function() {
    if (this.props.message) {
      return (
        <div className={"alert alert-"+this.props.type}>{this.props.message}</div>
      )
    } else {
      return <div />;
    }
  }
});

module.exports = ErrorMsg;
