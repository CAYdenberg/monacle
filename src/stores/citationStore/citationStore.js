var _ = require('underscore');
var utils = require('../../utils');
var EE = require('event-emitter');

var emitter = EE({});

var dispatcher = utils.dispatcher;

/**
 * How a single paper is represented in the store:
 {
   pmid : unique ID,
   pubmedSummary: {Object - data returned from pubmed},
   pmc : unique ID,
   doi : unique ID,
   abstract : String,
   fulltext : String,
   userData : {Object - data set for this record by the user}
 }
 */

function CitationStore() {


  this.items = [];
  this.index = [];
  this.total = null; //this is different from this.items.length as it is agnostic whether all items are loaded
  this.apiUrlBase = '/citations/';

  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'GET_DETAILS':
        //get citing papers here
        break;

      default:
        return true;

    }
  }.bind(this));
}

CitationStore.prototype.onUpdate = function(callback) {
  emitter.on('UPDATE', callback);
}

CitationStore.prototype.offUpdate = function(callback) {
  emitter.off('UPDATE', callback);
}

CitationStore.prototype.createIndex = function() {
  this.index = _.pluck(this.items, 'pmid');
}

CitationStore.prototype.sortItems = function(sortingFunction) {
  if (_.isFunction(sortingFunction)) {
    this.items.sort(sortingFunction);
  } else {
    //default sorting function: reverse chronological
    this.items.sort(function(a, b) {
      var aNumericDate = a.pubmedSummary.sortpubdate.replace(/\D/g,'');
      var bNumericDate = b.pubmedSummary.sortpubdate.replace(/\D/g,'');
      return bNumericDate - aNumericDate;
    });
  }
  this.createIndex();
}

CitationStore.prototype.importItem = function(item) {
  this.items.push(item);
}

CitationStore.prototype.importItems = function(items) {
  _.each(items, function(item) {
    this.importItem(item);
  }.bind(this));
  this.sortItems();
  emitter.emit('UPDATE');
  console.log(this);
}

CitationStore.prototype.setTotal = function(total) {
  this.total = total;
}

CitationStore.prototype.getItem = function(pmid) {
  var index = this.index.indexOf(pmid);
  return this.items[index];
}

CitationStore.prototype.setItem = function(pmid, item) {
  var index = this.index.indexOf(pmid);
  this.items[index] = item;
  return item;
}

CitationStore.prototype.updateItem = function(pmid, updates) {
  //find the item
  var item = this.getItem(pmid);
  //update it
  item = _.extend(item, updates);
  //put it back into this.items
  this.setItem(pmid, item);
  emitter.emit('UPDATE');
  return item;
}

CitationStore.prototype.deleteItem = function(pmid) {
  var index = this.index.indexOf(pmid);
  this.items.splice(index, 1);
  this.createIndex();
  emitter.emit('UPDATE');
}

module.exports = new CitationStore();
