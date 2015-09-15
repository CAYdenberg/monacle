var React = require('react');

module.exports = function(store) {

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

  return ErrorMsg;
}
