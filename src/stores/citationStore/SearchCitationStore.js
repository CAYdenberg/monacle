var _ = require('underscore');
var ncbi = require('node-ncbi');
var utils = require('../../utils');

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

var Parent = require('./citationStore.js');

function CitationStore() {

  Parent.constructor.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        ncbi.pubmedSearch(payload.content.queryString).then(function(data) {
          o.total = parseInt(data.count, 10);
          o.importItems(data.papers);
        }, function(err) {
          notifier.create('lostPubmed');
          console.log(err);
        });
        break;

      case 'LOAD_MORE':
        if ( o.items.length < o.total ) {
          ncbi.pubmedSearch(payload.content.queryString, {
            start: o.items.length,
            end: o.items.length + 10
          }).then(function(data) {
            o.importItems(data.papers);
          });
        }
        break;

      case 'GET_DETAILS':
        ncbi.getAbstract(payload.content.pmid).then(function(data) {
          o.updateItem(payload.content.pmid, {abstract: data});
        });
        break;

    }
  });
}

CitationStore.prototype = Object.create(Parent.constructor.prototype);

CitationStore.prototype.importItem = function(pubmedRecord) {
  //copy the article ids into the top-level of the object
  //change "pubmed" (which is very generic) to "pmid"
  var item = {
    pubmedSummary: pubmedRecord,
    pmid : null,
    pmc : null,
    doi : null,
    abstract : null,
    fulltext : null,
    userData : null
  };
  //loop through the article ids, copying to the top-level.
  //Change pubmed to pmid.
  _.each(pubmedRecord.articleids, function(idObject) {
    if (idObject.idtype === 'pubmed') {
      item.pmid = idObject.value;
    }
    if (['doi', 'pmc'].indexOf(idObject.idtype) !== -1 ) {
      item[idObject.idtype] = idObject.value;
    }
  });
  this.items.push(item);
}

module.exports = new CitationStore();
