var React = require('react');

var utils = require('../utils');

//bind to stores
var store = null;
var folderStore = null;

//subcomponents
var CitationDetails = require('./CitationDetails.js');

/**
 * Rendered at #single-citation BY the Citation component.
 * This components is RE-MOUNTED each time an item in the accordion is clicked.
 * It has direct access to the citation store, where it grabs data for a particular
 * citation, based on its pmid property.
 */
var SingleCitation = React.createClass({
  getInitialState: function() {
    store = this.props.store;
    folderStore = this.props.folderStore;
    return {
      data: store.getItem(this.props.pmid)
    }
  },
  citationsUpdated: function() {
    this.setState({data: store.getItem(this.props.pmid)});
  },
  componentWillMount: function() {
    store.onUpdate(this.citationsUpdated);
  },
  componentWillUnmount: function() {
    store.offUpdate(this.citationsUpdated);
  },
  render: function() {
    return (
      <div>
        <h5><span className="year">{utils.formatYear(this.state.data.pubmedSummary.pubdate)}</span></h5>
        <h4>{this.state.data.pubmedSummary.title}</h4>
        <h5 className="author-list">{utils.formatAuthorList(this.state.data.pubmedSummary.authors)}</h5>
        <CitationDetails data={this.state.data} folderStore={folderStore} />
      </div>
    )
  }
});

module.exports = SingleCitation;
