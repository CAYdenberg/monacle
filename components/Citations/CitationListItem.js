const React = require('react')
const PropTypes = require('prop-types')
const formatYear = require('../../lib/formatYear');
const CitationDetails = require('./CitationDetails');

/**
 * An individual citation. When clicked, opens the accordion (visible only on small screens)
 * renders the single citation area (pushes citation data and folderStore resource)
 * and triggers the dispatcher to grab details if they aren't available.
 * Mounted by CitaionList
 */
class CitationListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this
    return (
      <div className="panel panel-info">
        <a href="#" onClick={() => props.open(props.data.pmid)}>
          <div className="panel-heading">
            <h4>
              {props.data.title}
            </h4>
            <h5 className="author-list">
              {props.data.authors},&nbsp;
              <span className="year">{formatYear(props.data.pubDate)}</span>
            </h5>
          </div>
        </a>
        <div className={'panel-collapse collapse ' + (props.isOpen ? 'in' : '')}>
          <div className="panel-body hidden-md hidden-lg">
            <CitationDetails data={props.data} />
          </div>
        </div>
      </div>
    );
  }
}

CitationListItem.propTypes = {
  data: PropTypes.shape({
    pmid: PropTypes.number.isRequired,
    pubDate: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
  }).isRequired,

  open: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

module.exports = CitationListItem
