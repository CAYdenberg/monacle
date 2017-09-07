const popsicle = require('popsicle');

const actions = {

  search: function(query, page = 0) {

    const respond = function(res) {
      if (res.status === 200) {
        const data = JSON.parse(res.body);
        return {
          type: 'ADD_CITATIONS',
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
          type: 'ADD_CITATION_INFO',
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
          type: 'ADD_CITATION_INFO',
          pmid,
          changes: {oaLocations: data.oa_locations}
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

module.exports = actions;
