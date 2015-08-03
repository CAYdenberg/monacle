var _ = require('underscore');
var utils = require('../utils.js');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var ncbi = require('../../lib/NCBI/ncbi.js');

function CitationStore() {

  this.items = [];
  this.total = 0;
  this.endOfResults = false;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        var search = ncbi.pubmedSearch(payload.content.queryString);
        search.then(function(data) {
          this.total = data.total;
          this.importItems(data.papers);
        }.bind(this)).then(function() {
          emitter.emit('CITATIONS_UPDATED');
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

      default:
        return true;

    }

    console.log(this.items);
  }.bind(this));
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
}

CitationStore.prototype.importItem = function(pubmedRecord) {
  //copy the article ids into the top-level of the obejct
  _.each(pubmedRecord.articleids, function(idObject) {
    if ( ['doi', 'pubmed', 'pmc'].indexOf(idObject.idtype) !== -1 ) {
      pubmedRecord[idObject.idtype] = idObject.value;
    }
  });
  var item = _.extend({
    pubmed : null,
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

CitationStore.prototype.updateItems = function(pubmed, updates) {
  updatedItems = _.map( this.items, function(item) {
    if (item.pubmed === pubmed) {
      _.extend(item, updates);
    }
    return item;
  });
  this.items = updatedItems;
}

module.exports = CitationStore;
