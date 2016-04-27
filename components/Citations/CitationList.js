var React = require('react');

//subcomponents
const CitationDetails = require('./CitationDetails');
// const ProgressBar = require('../partials/ProgressBar');

/**
* The full list of citations, located at #citations
* This component is exported.
**/
const CitationList = React.createClass({
  render: function() {
    if (this.props.totalItems === 0) {
      return (
        <h2 className="nothing-found">No papers found</h2>
      );
    } else {
      return (
        <div className="citations-pane">
          <div className="panel-group citations-panel">
            {
              this.props.items.map((item) => {
                return (
                  <Citation
                    key={item.pmid}
                    data={item}
                    folderStore={this.props.folderStore}
                    openCitation={this.props.openCitation}
                    isCurrent={(item === this.props.currentItem)}
                  />
                );
              })
            }
          </div>
        </div>
      );
    }
  }
});

/**
 * An individual citation. When clicked, opens the accordion (visible only on small screens)
 * renders the single citation area (pushes citation data and folderStore resource)
 * and triggers the dispatcher to grab details if they aren't available.
 * Mounted by CitaionList
 */
const Citation = React.createClass({
  open: function() {
    this.props.openCitation(this.props.data.pmid);
  },

  render: function() {
    return (
      <div className="panel panel-info">
        <a href="#" onClick={this.open}>
          <div className="panel-heading">
            <h4>
              {this.props.data.pubmedSummary.title}
            </h4>
            <h5 className="author-list">
              {this.props.data.authorStr},
              <span className="year">{this.props.data.year}</span>
            </h5>
          </div>
        </a>
        <div className={'panel-collapse collapse ' + (this.props.isCurrent ? 'in' : '')}>
          <div className="panel-body">
            <CitationDetails data={this.props.data} folderStore={this.props.folderStore} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CitationList;
