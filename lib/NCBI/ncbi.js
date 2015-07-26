var _ = require('underscore');
var Api = require('./src/Api.js');
var Parser = require('./src/Parser.js');

module.exports = {
  pubmedSearch : function(query, args) {
    var defaults = {
      page : 0,
      resultsPerPage : 10
    }
    var settings = _.extend(defaults, args);

    var search = new Api({
      method : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : settings.page * settings.resultsPerPage + 1,
        retmax : (settings.page + 1) * settings.resultsPerPage
      }
    });
    var summary = new Api({
      method : 'esummary',
      params : {
        db : 'pubmed'
      }
    });
    return search.retrieve('ids').then(function(data) {
      summary.addIds(data);
      return summary.retrieve('summaries');
    });
  },

  getAbstract : function(pmids) {
    //accept either single pmids or multiple
    if ( _.isNumber(pmids) ) {
      pmids = [pmids];
    }
    var api = new Api({
      method : 'efetch',
      responseType : 'xml',
      params : {
        db : 'pubmed'
      }
    });
    api.addIds(pmids);
    return api.retrieve('abstract').then(function(abstracts) {
      if (abstracts.length === 1 && pmids.length === 1) {
        //if exactly 1 abstract was requested and exactly 1 was found,
        //return it as a string
        return abstracts[0];
      } else {
        //in all other cases (inluding none found), return an array
        return abstracts;
      }
    });
  }

}
