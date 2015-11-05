var _ = require('underscore');

var ncbi = require('node-ncbi');

var dispatcher = require('../../utils').dispatcher;
var emitter = require('../../utils').emitter;

var Parent = require('./CitationStore.js');

function CitationStore() {

  Parent.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        var search = ncbi.pubmedSearch(payload.content.queryString).then(function(data) {
          o.total = data.count;
          o.importItems(data.papers);
          console.log(o);
        }).then(function(data) {
          emitter.emit('CITATIONS_UPDATED');
        }).catch(function(err) {
          console.log(err);
        });
        break;

      case 'LOAD_MORE':
        if ( o.items.length < o.total ) {
          var search = ncbi.pubmedSearch(payload.content.queryString, {
            start: o.items.length,
            end: o.items.length + 10
          }).then(function(data) {
            o.importItems(data.papers);
          }).then(function() {
            emitter.emit('CITATIONS_UPDATED')
          });
        }
        break;

      case 'GET_DETAILS':
        ncbi.getAbstract(payload.content.pmid).then(function(data) {
          o.updateItems(payload.content.pmid, {abstract : data});
        }).then(function() {
          emitter.emit('CITATIONS_UPDATED');
        });
        break;

    }
  });
}

CitationStore.prototype = Object.create(Parent.prototype);

CitationStore.prototype.importItem = function(pubmedRecord) {
  //copy the article ids into the top-level of the object
  //change "pubmed" (which is very generic) to "pmid"
  _.each(pubmedRecord.articleids, function(idObject) {
    if (idObject.idtype === 'pubmed') {
      pubmedRecord['pmid'] = idObject.value;
    }
    if ( ['doi', 'pmc', 'pubmed'].indexOf(idObject.idtype) !== -1 ) {
      pubmedRecord[idObject.idtype] = idObject.value;
    }
  });
  //set all unique identifiers to null if they dont exist.
  //Note the change from "pubmed" to "pmid"
  var item = _.extend({
    pmid : null,
    pubmed: null,
    pmc : null,
    doi : null,
    abstract : null,
    fulltext : null,
    extras : null
  }, pubmedRecord);
  this.items.push(item);
}

module.exports = CitationStore;
