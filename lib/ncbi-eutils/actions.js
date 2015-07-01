var _ = require('underscore');

var Eutils = require('./Eutils.js');
var Parser = require('./Parser.js');

var docParser = new Parser('entireResponse'),
  idParser = new Parser('ids'),
  summaries = new Parser('summaries');


module.exports = {
  pubmedSearch : function(callback, query, args) {
    var defaults = {
      page : 0,
      resultsPerPage : 20
    }
    var settings = _.extend(defaults, args);

    var search = new Eutils({
      method : 'esearch',
      params : {
        db : 'pubmed',
        term : query,
        retstart : settings.page * settings.resultsPerPage + 1,
        retmax : (settings.page + 1) * settings.resultsPerPage
      }
    });
    var summary = new Eutils({
      method : 'esummary',
      params : {
        db : 'pubmed'
      }
    });
    search.retrieve(idParser).then(function(ids) {
      summary.addIds(ids);
      console.log(summary.generateUrl());
      return summary.retrieve(summaries);
    }).then(function(data) {
      callback(data);
    });
  },
}
