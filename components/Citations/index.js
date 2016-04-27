const React = require('react');

const utils = require('../../lib');
const dispatcher = utils.dispatcher;

const CitationList = require('./CitationList');
const SingleCitation = require('./SingleCitation');

const Citations = React.createClass({

  store: null,
  folderStore: null,

  getInitialState: function() {
    this.store = this.props.store;
    this.folderStore = this.props.folderStore;
    return ({
      items: this.store.items,
      currentItem: null,
      totalItems: this.store.total,
      loading: false,
      more: (this.store.nMore() > 0)
    });
  },

  componentDidMount: function() {
    this.store.onUpdate(() => {
      this.setState({
        items: this.store.items,
        //the number of results remaining:
        totalItems: this.store.total,
        loading: false
      });
    });
  },

  openCitation: function(pmid) {
    const item = this.store.getItem(pmid);
    this.setState({
      currentItem: item
    });
    if (!item.abstract) {
      dispatcher.dispatch({
        type: 'GET_DETAILS',
        content: {pmid: pmid}
      });
    }
  },

  loadMore: function() {
    this.setState({loading: true});
    dispatcher.dispatch({
      type: 'LOAD_MORE'
    });
  },

  render: function() {
    // <div data-todo="render single citation here" />
    // openCitation={this.openCitation}
    return (
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <CitationList
            items={this.state.items}
            currentItem={this.state.currentItem}
            totalItems={this.state.totalItems}
            openCitation={this.openCitation}
            folderStore={this.folderStore}
          />
          <LoadMoreButton
            loading={this.state.loading}
            more={this.state.more}
            loadMore={this.loadMore}
          />
        </div>
        <div className="col-md-6 hidden-sm hidden-xs">
          <SingleCitation
            data={this.state.currentItem}
            folderStore={this.folderStore}
          />
        </div>
      </div>
    );
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
    if (this.props.loading) {
      return (
        <ProgressBar />
      );
    } else if (!this.props.more) {
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

module.exports = Citations;
