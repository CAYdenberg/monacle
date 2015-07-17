var _ = require('underscore');
var Api = require('./src/Api.js');
var parsers = require('./src/parsers.js');

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
    return search.retrieve(parsers.ids).then(function(data) {
      summary.addIds(data);
      return summary.retrieve(parsers.summaries);
    }).then(function(data) {
      return data;
    });
  },

}
