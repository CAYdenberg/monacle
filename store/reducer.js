const update = require('react-addons-update');

module.exports = function(initialState, action) {
  const state = Object.assign({
    citations: []
  }, initialState);

  switch(action.type) {
    // append a bunch to the list
    case 'ADD_CITATIONS':
      return update(state, {citations: {$push: action.add}});


    // add other info (such as the abstract) to the list
    case 'ADD_CITATION_INFO':
      const citations = state.citations.map(citation => {
        if (parseInt(citation.uid, 10) === parseInt(action.pmid, 10)) {
          return update(citation, {$merge: action.changes})
        }
        return citation;
      });
      return update(state, {citations: {$set: citations}});

    default:
      return state;
  }

}
