var Api = require('./Api.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');

function Parser(data, parserName) {
  var dataObj,
    isValid = true;
  //read data: JS object, XML, or JSON
  if ( _.isObject(data) ) {
    dataObj = data;
  } else {
    try {
      dataObj = JSON.parse(data);
    } catch(err) {
      parseString(data, function(err, result) {
        if (err) {
          isValid = false;
        } else {
          dataObj = result
        }
      });
    }
  }
  //set properties
  if (isValid) {
    this.isValid = true;
    this.data = dataObj;
    if ( _.isFunction(this[parserName]) ) {
      this.result = this[parserName](dataObj);
    }
  } else {
    this.isValid = false;
    this.data = null;
    this.result = null;
  }
}

Parser.prototype._deepSearch = function deepSearch(data, find) {
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

Parser.prototype.count = function() {
  return this.result = this.data.esearchresult.count;
}

Parser.prototype.ids = function() {
  return this.result = this.data.esearchresult.idlist;
}

Parser.prototype.summaries = function() {
  summaryArr = _.map(this.data.result, function(summary, key) {
    //papers are indexed by their uid.
    if ( parseInt(key, 10) ) {
      return summary;
    } else {
      return false;
    }
  });
  return this.result = _.without(summaryArr, false);
}

Parser.prototype.abstract = function(single) {
  var record,
    abstractObjs,
    abstractArr = [];
  //convert XML to JS object
  abstractObjs = this._deepSearch(this.data, 'AbstractText');
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

module.exports = Parser;
