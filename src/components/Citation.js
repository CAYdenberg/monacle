var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="item">
        <h4>{this.props.data.title}</h4>
        <h5>{this.props.data.author}</h5>
      </div>
    )
  }
});
