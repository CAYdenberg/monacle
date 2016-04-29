var _ = require('underscore');
var ncbi = require('node-ncbi');
var utils = require('../../utils');

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

var Parent = require('./citationStore.js');

const RESULTS_PER_PAGE = 10;

function CitationStore() {

  Parent.constructor.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'NEW_SEARCH':
        var search = ncbi.createSearch(payload.content.queryString, {
          resultsPerPage: RESULTS_PER_PAGE
        });
        search.search().then(function(data) {
          o.total = parseInt(search.count(), 10);
          o.importItems(data);
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
          const page = Math.floor(o.items.length / RESULTS_PER_PAGE);
          ncbi.createSearch(payload.content.queryString, {
            resultsPerPage: RESULTS_PER_PAGE
          }).getPage(page).then(function(data) {
            o.importItems(data);
          });
        }
        break;

      case 'GET_DETAILS':
        //retrieve abstract from NCBI if we don't already have it
        if (!o.getItem(payload.content.pmid).abstract) {
          ncbi.createCitation(payload.content.pmid).abstract().then(function(data) {
            o.updateItem(payload.content.pmid, {abstract: data});
          });
        }
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
