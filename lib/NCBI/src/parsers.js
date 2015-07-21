var Api = require('./Api.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

function deepSearch(data, find) {
  var found = [];
  if ( ! _.isObject(data) ) {
    return [];
  }
  _.each(data, function(value, key) {
    if (key === find) {
      found.push(value);
    }
    found = found.concat(deepSearch(value, find));
  });
  return found;
}

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
    return cleanArr = _.without(summaryArr, false);
  },
  abstract : function(data, single) {
    var record,
      abstractObjs,
      abstractArr = [];
    //convert XML to JS object
    parseString(data, function(err, result) {
      record = result;
    });
    abstractObjs = deepSearch(record, 'AbstractText');
    _.each(abstractObjs, function(value) {
      //the actual text is stored inside another array inside a property indexed '_'
      abstractArr.push(value[0]._);
    });
    //figure out what to return based on whether single is true;
    if (single) {
      return abstractArr[0];
    } else {
      return abstractArr;
    }
  }
}
