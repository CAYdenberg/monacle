var React = require('react');
var ReactDOM = require('react-dom');

var utils = require('../utils');
var dispatcher = utils.dispatcher;

//store references
var store = null;
var folderStore = null;

//subcomponents
var SingleCitation = require('./SingleCitation.js');
var CitationDetails = require('./CitationDetails.js');
var ProgressBar = require('./partials/ProgressBar.js');

/**
* The full list of citations, located at #citations
* This component is exported.
**/
var CitationList = React.createClass({
  getInitialState : function() {
    store = this.props.citationStore;
    folderStore = this.props.folderStore;
    return {
      items : [],
      nMore : 0
    }
  },
  componentWillMount : function() {
    store.onUpdate(function() {
      this.setState({
        items: store.items,
        //the number of results remaining:
        nMore: (store.total - store.items.length)
      });
    }.bind(this));
  },
  render : function() {
    if (store.total === 0) {
      return (
        <h2 className="nothing-found">No papers found</h2>
      );
    } else {
      return (
        <div className="panel-group" id="accordion">
          {
            this.state.items.map(function(item) {
              return ( <Citation key={item.pmid} data={item} /> );
            })
          }
          <LoadMoreButton nMore={this.state.nMore} />
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
var Citation = React.createClass({
  //NOTE: the action which triggers this method also opens the accordion
  toggleDetails : function(e) {
    e.preventDefault();
    //kill and then re-render the single citation area
    ReactDOM.unmountComponentAtNode(document.getElementById('single-citation'));
    ReactDOM.render(<SingleCitation pmid={this.props.data.pmid} store={store} folderStore={folderStore} />, document.getElementById('single-citation'));
    if (!this.props.data.abstract) {
      //... then lets go get it
      dispatcher.dispatch({
        type: 'GET_DETAILS',
        content: {pmid: this.props.data.pmid}
      });
    }
  },
  render: function() {
    var headingId = "heading-PMID" + this.props.data.pmid;
    var collapseId = "collapse-PMID" + this.props.data.pmid;
    return (
      <div className="panel panel-info">
        <a href="#" onClick={this.toggleDetails} data-toggle="collapse" data-parent="#accordion" data-target={"#" + collapseId}>
          <div className="panel-heading" id={headingId}>
            <h4>
              {this.props.data.pubmedSummary.title}
            </h4>
            <h5 className="author-list">
              {utils.formatAuthorList(this.props.data.pubmedSummary.authors)},
              &nbsp;<span className="year">{utils.formatYear(this.props.data.pubmedSummary.pubdate)}</span>
            </h5>
          </div>
        </a>
        <div className="panel-collapse collapse" id={collapseId}>
          <div className="panel-body">
            <CitationDetails data={this.props.data} folderStore={folderStore} />
          </div>
        </div>
      </div>
    )
  }
});

/**
 * Displayed at the end of the citation list.
 * Shows a progress bar if the store is currently loading,
 * an end of results message if there are no more results,
 * and a link to load more results if there are more results.
 * Rendered by CitationList, passed the number of remaining results.
 * Figures out for itself if the store is loading results, updates itself
 * accordingly.
 **/
var LoadMoreButton = React.createClass({
  getInitialState : function() {
    return {
      loading : true
    }
  },
  componentWillMount : function() {
    store.onUpdate(function() {
      this.setState({loading: false});
    }.bind(this));
  },
  loadMore : function(e) {
    e.preventDefault();
    if (this.props.nMore > 0) {
      this.setState({loading: true});
      dispatcher.dispatch({
        type: 'LOAD_MORE',
        content: {queryString: window.globals.query}
      });
    }
  },
  render : function() {
    if (this.state.loading) {
      return (
        <ProgressBar />
      );
    } else if (!this.props.nMore) {
      return (
        <span className="results-end">End of results</span>
      )
    } else {
      return (
        <a href="#" onClick={this.loadMore}>Load more ...</a>
      );
    }
  }
});

module.exports = CitationList;
