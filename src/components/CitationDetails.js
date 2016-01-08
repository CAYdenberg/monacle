var React = require('react');
var _ = require('underscore');

var utils = require('../utils');
var dispatcher = utils.dispatcher;

//store references
var folderStore = null;

var ProgressBar = require('./partials/ProgressBar.js');

/**
 * Of the details of a citation.
 * Rendered by Citation and SingleCitation.
 * Sets the reference to the folder store so that it can be used to show the select.
 *
 * NOTE: This component is smart with respect to folders (imports the data directly from the store)
 * but dumb with respect to citations (passed the data from SingleCitation or CitationList/Citation).
 */
var CitationDetails = React.createClass({
  componentWillMount: function() {
    folderStore = this.props.folderStore;
  },
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
          <SaveMenu data={this.props.data} />
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
var LensLink = React.createClass({
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

/**
* Menu of folders to save citation to. Triggers save method in folder store (via the Dispatcher)
*/
var SaveMenu = React.createClass({
  getInitialState: function() {
    return ({
      folders: folderStore.folders,
      currentFolder: folderStore.currentFolder
    });
  },
  componentWillMount: function() {
    folderStore.onUpdate(function() {
      this.setState({
        folders: folderStore.folders,
        currentFolder: folderStore.currentFolder
      });
    }.bind(this));
  },
  saveCitation: function(e) {
    var newFolder = e.target.value;
    dispatcher.dispatch({
      type: 'SAVE_CITATION',
      content: {folderSlug: newFolder, data: this.props.data}
    });
  },
  render: function() {
    console.log(this.state);
    if (this.state.folders.length) {
      return (
        <div className="margin-vertical">
          <label htmlFor="save-to-folder">Save to:</label>
          <select id="save-to-folder" className="form-control" onChange={this.saveCitation} value={this.state.currentFolder}>
            <option value=""></option>
            {
              this.state.folders.map(function(item) {
                return (<SaveOption item={item} key={item.slug} />)
              })
            }
          </select>
        </div>
      )
    } else {
      return (<div />);
    }
  }
});

/**
 * Individual options in the folders list.
 * Rendered by SaveMenu
 */
var SaveOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.item.slug}>{this.props.item.name}</option>
    )
  }
});

module.exports = CitationDetails;
