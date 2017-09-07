const React = require('react');

const CitationList = require('./CitationList');
const SingleCitation = require('./SingleCitation');
const ProgressBar = require('../partials/ProgressBar')

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
      loading: true
    });
  },

  componentDidMount: function() {
    this.store.subscribe(() => {
      this.setState(this._mapState());
      this.setState({loading: false});
    });
  },

  getItemData: function(pmid) {
    return this.state.items.reduce((data, item) => {
      if (data) {
        return data;
      } else {
        return (pmid === item.pmid) ? item : null;
      }
    }, null);
  },

  openCitation: function(pmid) {
    this.setState({
      currentItem: pmid
    });
    const itemData = this.getItemData(pmid)
    if (!itemData || !itemData.abstract) {
      this.store.dispatch(actions.getAbstract(pmid));
      this.store.dispatch(actions.getOaLocations(pmid, itemData.doi));
    }
  },

  isCurrent: function(pmid) {
    return (this.state.currentItem === pmid);
  },

  loadMore: function() {
    this.setState({
      loading: true
    });
    this.store.dispatch(actions.search(window.appData.query, this.store.getState().nextPage));
  },

  render: function() {

    return (
      <div>

        <div className="citation-panel-wrapper">
          <div className="citation-panel">
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
      </div>

      <div className="citation-panel-wrapper hidden-sm hidden-xs">
        <div className="citation-panel">
          <SingleCitation
            data={this.getItemData(this.state.currentItem)}
          />
        </div>
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
        <a href="#" onClick={this.props.loadMore} className="btn btn-lg btn-success">Load more ...</a>
      );
    }
  }
});

module.exports = Citations;
