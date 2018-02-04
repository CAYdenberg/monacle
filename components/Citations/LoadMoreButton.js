const React = require('react')
const PropTypes = require('prop-types')
const ProgressBar = require('../partials/ProgressBar');

/**
 * Displayed at the end of the citation list.
 * Shows a progress bar if the store is currently loading,
 * an end of results message if there are no more results,
 * and a link to load more results if there are more results.
 * Rendered by CitationList, passed the number of remaining results.
 * Figures out for itself if the store is loading results, updates itself
 * accordingly.
 **/
const LoadMoreButton = props => {
  if (props.loading) {
    return (
      <ProgressBar />
    );
  } else if (!props.more) {
    return (
      <span className="results-end">End of results</span>
    )
  } else {
    return (
      <a href="#" onClick={props.loadMore} className="btn btn-lg btn-success">Load more ...</a>
    );
  }
}

LoadMoreButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  more: PropTypes.bool.isRequired,
  loadMore: PropTypes.func.isRequired,
}

module.exports = LoadMoreButton
