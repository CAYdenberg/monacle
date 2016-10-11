const popsicle = require('popsicle');

const actions = {

  search: function(query, page = 0) {

    const respond = function(res) {
      if (res.status === 200) {
        return {
          type: 'ADD_CITATIONS',
          count: res.body.count,
          add: res.body.papers
        }
      }
    };

    return function(dispatch) {
      return popsicle({
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
          type: 'ADD_CITATION_INFO',
          pmid: pmid,
          changes: {abstract: res.body}
        }
      }
    }

    return function(dispatch) {
      return popsicle({
        method: 'GET',
        url: '/api/pubmed/abstract/' + pmid
      }).then(res => dispatch(respond(res)));
    }

  }
}

module.exports = actions;
