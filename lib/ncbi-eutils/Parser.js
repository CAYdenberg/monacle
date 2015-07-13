var Eutils = require('./Eutils.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');


//callback may be a string identifying a built-in protocol, or it may
//be an actual function
function Parser(callback) {
  //built in functions for extracing data
  var protocols = {
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

  //set the callback
  if (_.isString(callback)) {
    if (protocols[callback]) {
      this.callback = protocols[callback];
    } else {
      this.callback = false;
    }
  } else if (_.isFunction(callback)) {
    this.callback = callback;
  } else {
    this.callback = false;
  }
}

Parser.prototype.parse = function(data) {
  return this.callback(data);
}


module.exports = Parser;
