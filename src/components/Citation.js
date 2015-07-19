var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({
  formatAuthorList : function() {
    var authArr,
      authStr = '';
    if (this.props.data.authors) {
      authArr = _.map(this.props.data.authors, function(author) {
        return author.name;
      });
      authStr = authArr.join(', ');
    }
    return authStr;
  },
  render: function() {
    return (
      <div className="item">
        <h4>{this.props.data.title}</h4>
        <h5>{this.formatAuthorList()}</h5>
      </div>
    )
  }
});
