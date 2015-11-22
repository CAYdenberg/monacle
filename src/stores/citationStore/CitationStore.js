var _ = require('underscore');
var popsicle = require('popsicle');

var utils = require('../../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

function CitationStore() {

  this.items = [];
  this.index = [];
  this.total = 0;
  this.apiUrlBase = '/citations/';

  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {
      case 'SAVE_TO_FOLDER':
        popsicle({
          method: 'POST',
          url: o.apiUrlBase + payload.content.folder + '/' + payload.content.pmid,
          body: {data: payload.content.data}
        }).then(function(res) {
          utils.notifier.create('addedToFolder');
        }, function(err) {
          utils.notifier.create('lostBackend');
        });
        break;
      default:
        return true;
    }
  }.bind(this));
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
      aNumericDate = a.pubmedSummary.sortpubdate.replace(/\D/g,'');
      bNumericDate = b.pubmedSummary.sortpubdate.replace(/\D/g,'');
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

module.exports = CitationStore;
