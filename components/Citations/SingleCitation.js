const React = require('react');
const formatYear = require('../../lib/formatYear');

//subcomponents
const CitationDetails = require('./CitationDetails');

const SingleCitation = props => {
  if (props.data) {

    return (
      <div>
        <h5><span className="year">{formatYear(props.data.pubDate)}</span></h5>
        <h4>{props.data.title}</h4>
        <h5 className="author-list">{props.data.authors}</h5>
        <CitationDetails data={props.data} />
      </div>
    )

  } else {

    return (
      <div />
    );

  }
}

module.exports = SingleCitation;
