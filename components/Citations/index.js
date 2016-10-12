const React = require('react');

const CitationList = require('./CitationList');
const SingleCitation = require('./SingleCitation');

const actions = require('../../store/actions');

const Citations = React.createClass({

  store: null,

  _mapState: function() {
    const appState = this.store.getState();
    return ({
      items: appState.citations,
      totalItems: appState.total,
      more: (appState.totalCitations > appState.citations.length)
    });
  },

  getInitialState: function() {
    this.store = this.props.store;
    return Object.assign(this._mapState(), {
      currentItem: null,
      loading: false
    });
  },

  componentDidMount: function() {
    this.store.subscribe(() => {
      this.setState(this._mapState());
    });
  },

  openCitation: function(item) {
    this.setState({
      currentItem: item
    });
    if (!item.abstract) {
      this.store.dispatch(actions.getAbstract(item.pmid));
    }
  },

  isCurrent: function(item) {
    return this.state.currentItem && (this.state.currentItem === item);
  },

  loadMore: function() {
    this.setState({
      loading: true
    });
    this.store.dispatch(actions.search(window.appData.query, this.store.getState().nextPage()));
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
            controller={this}
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
