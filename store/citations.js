const popsicle = require('popsicle');
const update = require('immutability-helper');

const constants = {
  ADD_CITATIONS: 'CITATIONS/ADD_CITATIONS',
  ADD_CITATION_INFO: 'CITATIONS/ADD_CITATION_INFO',
  NO_RESPONSE: 'CITATIONS/NO_RESPONSE',
}
const c = constants

const actions = {

  search: function(query, page = 0) {

    const respond = function(res) {
      if (res.status === 200) {
        const data = JSON.parse(res.body);
        return {
          type: c.ADD_CITATIONS,
          count: data.count,
          add: data.papers
        }
      }
    };

    return function(dispatch) {
      return popsicle.request({
        method: 'GET',
        url: '/api/pubmed/' + query,
        query: {page: page}
      }).then(res => dispatch(respond(res)));
    }

  },


  getAbstract: function(pmid) {

    const respond = function(res) {
      if (res.status === 200) {
        return {
          type: c.ADD_CITATION_INFO,
          pmid: pmid,
          changes: {abstract: res.body}
        }
      }
    }

    return function(dispatch) {
      return popsicle.request({
        method: 'GET',
        url: '/api/pubmed/abstract/' + pmid
      }).then(res => dispatch(respond(res)));
    }

  },

  getOaLocations: function(pmid, doi) {

    const respond = function(res) {
      const data = JSON.parse(res.body);
      if (res.status === 200) {
        return {
          type: c.ADD_CITATION_INFO,
          pmid,
          changes: {oaLocations: data.oa_locations}
        }
      } else {
        return {
          type: c.NO_RESPONSE
        }
      }
    }

    return function(dispatch) {
      return popsicle.request({
        method: 'GET',
        url: `https://api.oadoi.org/v2/${doi}?email=ydenberg@gmail.com`
      }).then(res => dispatch(respond(res)));
    }

  }
}

const reducer = function(initialState, action) {
  const state = Object.assign({
    totalCitations: 0,
    citations: [],
    nextPage: 0
  }, initialState);

  switch(action.type) {

    // append a bunch of papers to the list
    case c.ADD_CITATIONS:
      return update(state, {
        totalCitations: {$set: action.count},
        citations: {$push: action.add},
        nextPage: {$apply: (x) => x + 1}
      });

    // add other info (such as the abstract) to the list
    case c.ADD_CITATION_INFO:
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

module.exports = {
  constants,
  actions,
  reducer,
}
