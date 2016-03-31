var _ = require('underscore');
var ncbi = require('node-ncbi');
var utils = require('../../utils');

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

var Parent = require('./citationStore.js');

function CitationStore() {

  Parent.constructor.call(this);
  var o = this;
  var search = null;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        search = ncbi.createSearch(payload.content.queryString);
        search.getPage().then(function(papers) {
          o.total = parseInt(search.count());
          o.importItems(papers);
        }).catch(function(err) {
          notifier.create({
            class: 'danger',
            message: 'Cannot connect to NCBI',
            payload: payload
          });
          console.log(err);
        });
        break;

      case 'LOAD_MORE':
        if ( o.items.length < o.total ) {
          search.nextPage().then(function(papers) {
            o.importItems(papers);
          });
        }
        break;

      case 'GET_DETAILS':
        ncbi.createCitation(payload.content.pmid).abstract().then(function(abstract) {
          o.updateItem(payload.content.pmid, {abstract: abstract});
        });
        break;

    }
  });
}

CitationStore.prototype = Object.create(Parent.constructor.prototype);

CitationStore.prototype.importItem = function(pubmedRecord) {
  //define an Item
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
  _.each(pubmedRecord.articleids, function(idObject) {
    if (idObject.idtype === 'pubmed') {
      //Change pubmed to pmid. Make sure it's an integer.
      item.pmid = parseInt(idObject.value, 10);
    } else if (idObject.idtype === 'pmc') {
      //Remove PMC from the beginning of the string and make sure it's an integer.
      item.pmc = parseInt(idObject.value.replace("PMC", ""));
    } else if (idObject.idtype === 'doi') {
      //Move DOI to the top level
      item.doi = idObject.value;
    }
  });
  this.items.push(item);
}

module.exports = new CitationStore();
