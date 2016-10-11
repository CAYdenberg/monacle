var React = require('react');
var _ = require('underscore');

//required components
const ProgressBar = require('../partials/ProgressBar');

/**
 * Of the details of a citation.
 * Rendered by Citation and SingleCitation.
 * Sets the reference to the folder store so that it can be used to show the select.
 */
const CitationDetails = React.createClass({
  render: function() {
    if (_.isNull(this.props.data.abstract)) {
      return (
        <ProgressBar />
      )
    } else {
      return (
        <div className="citation-details">
          <div className="abstract">{this.props.data.abstract}</div>
          <LensLink link={this.props.data.pmc} />
          <div className="margin-vertical">
            <a href={"http://www.ncbi.nlm.nih.gov/pubmed/" + this.props.data.pmid} className="btn btn-info" target="_blank">
              <span className="icon-pubmed"></span> View on PubMed
            </a>
          </div>
        </div>
      )
    }
  }
});

/**
 * Link to the Lens representation of article.
 * Displayed ONLY if there is a PMC identifier (best way we have right now of
telling if article is open access)
 */
const LensLink = React.createClass({
  render: function() {
    if (this.props.link) {
      return (
        <div className="margin-vertical">
          <a href={"/lens/" + this.props.link} target="_blank" className="btn btn-success">
            <span className="icon-lens"></span> View in Lens
          </a>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
});

module.exports = CitationDetails;
