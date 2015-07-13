var Api = require('./Api.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

module.exports = {
  count : function(data) {
    return data.esearchresult.count;
  },
  ids : function(data) {
    return data.esearchresult.idlist;
  },
  wholeResponse : function(data) {
    return data;
  },
  summaries : function(data) {
    summaryArr = _.map(data.result, function(summary, key) {
      //papers are indexed by their uid.
      if ( parseInt(key, 10) ) {
        return summary;
      } else {
        return false;
      }
    });
    return cleanArr = _.without(summaryArr, false );
  }
}
