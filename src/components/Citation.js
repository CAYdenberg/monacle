var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="item">
        <h3>{this.props.data.title}</h3>
        <h5>{this.props.data.author}</h5>
      </div>
    )
  }
});
