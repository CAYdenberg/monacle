var React = require('react');

//required components
const ProgressBar = require('../../partials/ProgressBar');
const LensLink = require('./LensLink')

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
            <span className="icon-pubmed"></span> View on PubMed
          </a>
        </div>

        <OaLocations locations={props.data.oaLocations} />
      </div>
    )
  }
}

const OaLocations = props => {
  if (props.locations && props.locations.length) {
    return (
      <div className="oa-locations">
        <h5 className="oa-location__title">Open-access locations (oadoi.org)</h5>
        <ul className="oa-location__item">
          {props.locations.map(location =>
            <li><a href={location.url}>{location.url}</a></li>
          )}
        </ul>
      </div>
    )
  }
  return (
    <div />
  )
}

module.exports = CitationDetails;
