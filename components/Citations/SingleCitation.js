const React = require('react');
const PropTypes = require('prop-types');
const formatYear = require('../../lib/formatYear');

//subcomponents
const CitationDetails = require('./CitationDetails');

const SingleCitation = props => {
  return (
    <div>
      <h5><span className="year">{formatYear(props.data.pubDate)}</span></h5>
      <h4>{props.data.title}</h4>
      <h5 className="author-list">{props.data.authors}</h5>
      <CitationDetails data={props.data} />
    </div>
  )
}

SingleCitation.propTypes = {
  data: PropTypes.shape({
    pmid: PropTypes.number.isRequired,
    pubDate: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
  }),
}

module.exports = SingleCitation;
