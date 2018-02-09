const React = require('react')
const {connect} = require('react-redux')

const CitationList = require('./CitationList')
const SingleCitation = require('./SingleCitation')
const LoadMoreButton = require('./LoadMoreButton')

const {actions, selectors} = require('../../store/citations')

const mapStateToProps = (state) => {
  const {total, current, nextPage, items, loading} = state.citations
  return {
    loading,
    total,
    current,
    nextPage,
    items,
    isMorePages: selectors.isMorePages(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadMore: (query, page) => dispatch(actions.loadMore(query, page)),
    open: (pmid) => dispatch(actions.open(pmid)),
  }
}

class Citations extends React.Component {
  constructor(props) {
    super(props)

    this._loadMore = this._loadMore.bind(this)
  }

  _loadMore() {
    this.props.loadMore(window.appData.query, this.props.nextPage)
  }

  render() {
    const {props} = this

    return (
      <div>

        <div className="citation-panel-wrapper">
          <div className="citation-panel">
            <CitationList
              items={props.items}
              currentItem={props.current}
              totalItems={props.total}
              open={props.open}
            />
            <LoadMoreButton
              loading={props.loading}
              more={props.isMorePages}
              loadMore={this._loadMore}
            />
          </div>
        </div>

        <div className="citation-panel-wrapper hidden-sm hidden-xs">
          <div className="citation-panel">
            {props.current &&
              <SingleCitation
                data={props.items.find(item => item.pmid === props.current)}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Citations)
