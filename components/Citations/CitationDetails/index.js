var React = require('react');

//required components
const ProgressBar = require('../../partials/ProgressBar');
const LensLink = require('./LensLink')
const OaLocations = require('./OaLocations')

/**
 * Of the details of a citation.
 * Rendered by Citation and SingleCitation.
 * Sets the reference to the folder store so that it can be used to show the select.
 */
const CitationDetails = props => {
  if (!props.data.abstract) {
    return (
      <ProgressBar />
    );
  } else {
    return (
      <div className="citation-details">
        <div className="abstract">{props.data.abstract}</div>

        <LensLink link={props.data.pmc} />

        <div className="margin-vertical">
          <a href={"http://www.ncbi.nlm.nih.gov/pubmed/" + props.data.pmid} className="btn btn-info" target="_blank">
            <i className="icon-book"></i> View on PubMed
          </a>
        </div>

        <OaLocations locations={props.data.oaLocations} />
      </div>
    )
  }
}

module.exports = CitationDetails;
