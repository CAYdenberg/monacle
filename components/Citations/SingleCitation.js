const React = require('react');

//subcomponents
const CitationDetails = require('./CitationDetails');

const SingleCitation = React.createClass({

  render: function() {
    if (this.props.data) {

      return (
        <div>
          <h5><span className="year">{this.props.data.year}</span></h5>
          <h4>{this.props.data.pubmedSummary.title}</h4>
          <h5 className="author-list">{this.props.data.authorStr}</h5>
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
