var React = require('react');
const PropTypes = require('prop-types')

const CitationListItem = require('./CitationListItem');

//subcomponents
// const ProgressBar = require('../partials/ProgressBar');

/**
* The full list of citations, located at #citations
* This component is exported.
**/
const CitationList = props => {
  if (props.totalItems === 0) {
    return (
      <h2 className="nothing-found">No papers found</h2>
    );
  } else {
    return (
      <div className="citations-pane">
        <div className="panel-group citations-panel">
          {
            props.items.map((item) => {
              return (
                <CitationListItem
                  key={item.pmid}
                  data={item}
                  open={props.open}
                  isOpen={item.pmid === props.currentItem}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

CitationList.propTypes = {
  items: PropTypes.array.isRequired,
  open: PropTypes.func.isRequired,

  totalItems: PropTypes.number,
  currentItem: PropTypes.number,
}

module.exports = CitationList;
