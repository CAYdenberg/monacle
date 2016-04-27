const _ = require('underscore');
const emitter = require('event-emitter')({});

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

const CitationStore = {

  APIURLBASE: "/citations",

  onUpdate: function(callback) {
    emitter.on('UPDATE', callback);
  },

  offUpdate: function(callback) {
    emitter.off('UPDATE', callback);
  },

  createIndex: function() {
    this.index = _.pluck(this.items, 'pmid');
  },

  sortItems: function(sortingFunction) {
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
  },

  importItem: function(item) {
    this.items.push(item);
  },

  importItems: function(items) {
    _.each(items, (item) => {
      this.importItem(item);
    });
    this.sortItems();
    emitter.emit('UPDATE');
  },

  setTotal: function(total) {
    this.total = total;
  },

  getItem: function(pmid) {
    var index = this.index.indexOf(pmid);
    return this.items[index];
  },

  setItem: function(pmid, item) {
    var index = this.index.indexOf(pmid);
    this.items[index] = item;
    return item;
  },

  updateItem: function(pmid, updates) {
    //find the item
    var item = this.getItem(pmid);
    //update it
    item = _.extend(item, updates);
    //put it back into this.items
    this.setItem(pmid, item);
    emitter.emit('UPDATE');
    return item;
  },

  deleteItem: function(pmid) {
    var index = this.index.indexOf(pmid);
    this.items.splice(index, 1);
    this.createIndex();
    emitter.emit('UPDATE');
  },

  nMore: function() {
    return (this.total - this.items.length);
  }

}

module.exports = () => {
  return Object.assign(Object.create(CitationStore), {
    items: [],
    index: [],
    page: 0,
    total: null
  });
}
