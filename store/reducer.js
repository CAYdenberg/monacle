const update = require('react-addons-update');

module.exports = function(initialState, action) {
  const state = Object.assign({
    totalCitations: 0,
    citations: [],
    nextPage: 0
  }, initialState);

  switch(action.type) {

    // append a bunch of papers to the list
    case 'ADD_CITATIONS':
      return update(state, {
        totalCitations: {$set: action.count},
        citations: {$push: action.add},
        nextPage: {$apply: (x) => x + 1}
      });

    // add other info (such as the abstract) to the list
    case 'ADD_CITATION_INFO':
      const citations = state.citations.map(citation => {
        if (citation.pmid === action.pmid) {
          return update(citation, {$merge: action.changes})
        } else {
          return citation;
        }
      });
      return update(state, {citations: {$set: citations}});

    default:
      return state;
  }

}
