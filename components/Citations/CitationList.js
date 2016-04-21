var React = require('react');

//subcomponents
// const CitationDetails = require('./CitationDetails');
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
                return ( <Citation key={item.pmid} data={item} folderStore={this.props.folderStore} /> );
              })
            }
          </div>
          <LoadMoreButton nMore={this.props.totalItems - this.props.items.length} />
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
  render: function() {
    const headingId = "heading-PMID" + this.props.data.pmid;
    const collapseId = "collapse-PMID" + this.props.data.pmid;
    return (
      <div className="panel panel-info">
        <a href="#" onClick={this.toggleDetails} data-toggle="collapse" data-parent="#accordion" data-target={"#" + collapseId}>
          <div className="panel-heading" id={headingId}>
            <h4>
              {this.props.data.pubmedSummary.title}
            </h4>
            <h5 className="author-list">
              {this.props.data.authorStr},
              <span className="year">{this.props.data.year}</span>
            </h5>
          </div>
        </a>
        <div className="panel-collapse collapse" id={collapseId}>
          <div className="panel-body"></div>
        </div>
      </div>
    );
    // <CitationDetails data={this.props.data} folderStore={this.props.folderStore} />
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
const LoadMoreButton = React.createClass({
  render : function() {
    // if (this.state.loading) {
    //   return (
    //     <ProgressBar />
    //   );
    // } else
    if (!this.props.nMore) {
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
