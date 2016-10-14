const React = require('react');
const formatYear = require('../../lib/formatYear');

//subcomponents
const CitationDetails = require('./CitationDetails');

const SingleCitation = React.createClass({

  render: function() {

    if (this.props.data) {

      return (
        <div>
          <h5><span className="year">{formatYear(this.props.data.pubDate)}</span></h5>
          <h4>{this.props.data.title}</h4>
          <h5 className="author-list">{this.props.data.authors}</h5>
          <CitationDetails data={this.props.data} />
        </div>
      )

    } else {

      return (
        <div />
      );

    }
  }
});

module.exports = SingleCitation;
