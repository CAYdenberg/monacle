var React = require('react');
const formatYear = require('../../lib/formatYear');

//subcomponents
const CitationDetails = require('./CitationDetails');
// const ProgressBar = require('../partials/ProgressBar');


/**
* The full list of citations, located at #citations
* This component is exported.
**/
const CitationList = props => {
  if (props.totalItems === 0) {
    return (
      <h2 className="nothing-found">No papers found</h2>
    );
  } else {
    return (
      <div className="citations-pane">
        <div className="panel-group citations-panel">
          {
            props.items.map((item) => {
              return (
                <Citation
                  key={item.pmid}
                  data={item}
                  controller={props.controller}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

/**
 * An individual citation. When clicked, opens the accordion (visible only on small screens)
 * renders the single citation area (pushes citation data and folderStore resource)
 * and triggers the dispatcher to grab details if they aren't available.
 * Mounted by CitaionList
 */
class Citation extends React.Component {
  constructor(props) {
    super(props)

    this.open = this.open.bind(this)
  }

  open() {
    const {props} = this
    props.controller.openCitation(props.data.pmid);
  }

  render() {
    const {props} = this
    return (
      <div className="panel panel-info">
        <a href="#" onClick={this.open}>
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
        <div className={'panel-collapse collapse ' + (props.controller.isCurrent(props.data.pmid) ? 'in' : '')}>
          <div className="panel-body hidden-md hidden-lg">
            <CitationDetails data={props.data} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CitationList;
