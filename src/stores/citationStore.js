var _ = require('underscore');
var utils = require('../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var ncbi = require('../../lib/NCBI/ncbi.js');

function CitationStore() {

  this.items = [];
  this.index = [];
  this.total = 0;
  this.endOfResults = false;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        var search = ncbi.pubmedSearch(payload.content.queryString);
        search.then(function(data) {
          this.total = data.total;
          this.importItems(data.papers);
        }.bind(this)).then(function(data) {
          emitter.emit('CITATIONS_UPDATED');
        }).catch(function(err) {
          console.log(err);
        });
        break;

      case 'LOAD_MORE':
        if ( this.items.length < this.total ) {
          var search = ncbi.pubmedSearch(payload.content.queryString, {
            start: this.items.length,
            end: this.items.length + 10
          });
          search.then(function(data) {
            this.importItems(data.papers);
          }.bind(this)).then(function() {
            emitter.emit('CITATIONS_UPDATED')
          });
        }
        break;

      case 'GET_DETAILS':
        ncbi.getAbstract(payload.content.pmid).then(function(data) {
          this.updateItems(payload.content.pmid, {abstract : data});
        }.bind(this)).then(function() {
          emitter.emit('CITATIONS_UPDATED');
        });
        break;

      case 'SAVE_TO_FOLDER':
        break;

      default:
        return true;

    }

  }.bind(this));
}

CitationStore.prototype.createIndex = function() {
  this.index = _.pluck(this.items, 'pubmed');
}

CitationStore.prototype.sortItems = function(sortingFunction) {
  if (_.isFunction(sortingFunction)) {
    this.items.sort(sortingFunction);
  } else {
    //default sorting function: reverse chronological
    this.items.sort(function(a, b) {
      aNumericDate = a.sortpubdate.replace(/\D/g,'');
      bNumericDate = b.sortpubdate.replace(/\D/g,'');
      return bNumericDate - aNumericDate;
    });
  }
  this.createIndex();
}

CitationStore.prototype.importItem = function(pubmedRecord) {
  //copy the article ids into the top-level of the object
  _.each(pubmedRecord.articleids, function(idObject) {
    if ( ['doi', 'pubmed', 'pmc'].indexOf(idObject.idtype) !== -1 ) {
      pubmedRecord[idObject.idtype] = idObject.value;
    }
  });
  //set all unique identifiers to null if they dont exist.
  //Note the change from "pubmed" to "pmid"
  var item = _.extend({
    pmid : null,
    pmc : null,
    doi : null,
    abstract : null,
    fulltext : null,
    extras : null
  }, pubmedRecord);
  this.items.push(item);
}

CitationStore.prototype.importItems = function(data) {
  _.each(data, function(pubmedRecord) {
    this.importItem(pubmedRecord);
  }.bind(this));
  this.sortItems();
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

CitationStore.prototype.updateItems = function(pmid, updates) {
  //find the item
  var item = this.getItem(pmid);
  //update it
  item = _.extend(item, updates);
  //put it back into this.items
  this.setItem(pmid, item);
  return item;
}

module.exports = function() {
  return new CitationStore();
}
