const popsicle = require('popsicle');

const actions = {

  searchResponse: function(res) {
    if (res.status === 200) {
      return {
        type: 'ADD_CITATIONS',
        count: res.body.count,
        add: res.body.papers
      }
    }
  },

  search: function(query, page = 0) {
    return function(dispatch) {

      return popsicle({
        method: 'GET',
        url: '/api/pubmed/' + query,
        query: {page: page}
      }).then(res => dispatch(actions.searchResponse(res)));

    }
  },

  getAbstractResponse: function(res) {
    if (res.status === 200) {
      return {
        type: 'ADD_CITATION_INFO',
        pmid: pmid,
        changes: {abstract: res.body}
      }
    }
  },

  getAbstract: function(pmid) {
    return function(dispatch) {

      return popsicle({
        method: 'GET',
        url: '/api/pubmed/abstract/' + pmid
      }).then(res => dispatch(actions.getAbstractResponse(res)));

    }
  }

}

module.exports = actions;
