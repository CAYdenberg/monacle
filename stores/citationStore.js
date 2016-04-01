var _ = require('underscore');
var utils = require('../utils');
var EE = require('event-emitter');
var ncbi = require('node-ncbi');
var popsicle = require('popsicle');

var emitter = EE({});

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

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

var citationStore = {
  items: [],

  index: [],

  //this is different from this.items.length as it is agnostic whether all items are loaded:
  total: null,

  apiUrlBase: "/citations",

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
    console.log(this);
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

  saveCitationNotice: function(res) {
    switch (res.status) {
      case 200:
        notifier.create({
          class: 'success',
          message: 'Paper added to folder',
          autodismiss: true
        });
        break;

      case 400:
        notifier.create({
          class: 'warning',
          message: 'That paper is already in that folder'
        });
        break;

      case 404:
        notifier.create({
          class: 'danger',
          message: 'Cannot complete action'
        });
        break;

    }
  }

}

// CitationStore.prototype.importItem = function(pubmedRecord) {
//   //define an Item
//   var item = {
//     pubmedSummary: pubmedRecord,
//     pmid : null,
//     pmc : null,
//     doi : null,
//     abstract : null,
//     fulltext : null,
//     userData : null
//   };
//   //loop through the article ids, copying to the top-level.
//   _.each(pubmedRecord.articleids, function(idObject) {
//     if (idObject.idtype === 'pubmed') {
//       //Change pubmed to pmid. Make sure it's an integer.
//       item.pmid = parseInt(idObject.value, 10);
//     } else if (idObject.idtype === 'pmc') {
//       //Remove PMC from the beginning of the string and make sure it's an integer.
//       item.pmc = parseInt(idObject.value.replace("PMC", ""));
//     } else if (idObject.idtype === 'doi') {
//       //Move DOI to the top level
//       item.doi = idObject.value;
//     }
//   });
//   this.items.push(item);
// }

dispatcher.register(function(payload) {
  switch (payload.type) {

    case 'NEW_SEARCH':
      var search = ncbi.createSearch(payload.content.queryString);
      search.getPage().then(function(papers) {
        citationStore.total = parseInt(search.count());
        citationStore.importItems(papers);
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
      if ( citationStore.items.length < citationStore.total ) {
        search.nextPage().then(function(papers) {
          citationStore.importItems(papers);
        });
      }
      break;

    case 'GET_DETAILS':
      ncbi.createCitation(payload.content.pmid).abstract().then(function(abstract) {
        citationStore.updateItem(payload.content.pmid, {abstract: abstract});
      });
      break;


    case 'GET_FOLDER_CONTENTS':
      popsicle({
        method: 'GET',
        url: '/folders/' + payload.content.folder + '/'
      }).then(function(res) {
        if (res.status === 200) {
          citationStore.importItems(res.body);
          citationStore.total = citationStore.items.length;
        }
      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot retrieve papers at this time',
          payload: payload
        });
      });
      break;

    case 'SAVE_CITATION':
      popsicle({
        method: 'POST',
        url: '/folders/' + payload.content.folder + '/',
        body: payload.content.data
      }).then(function(res) {
        citationStore.saveCitationNotice(res);
      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot add paper at this time',
          payload: payload
        });
      })
      break;

    case 'MOVE_CITATION':
      popsicle({
        method: 'PUT',
        url: citationStore.apiUrlBase + payload.content.data.pmid + '/',
        body: {
          addFolder: payload.content.newFolder,
          removeFolder: payload.content.oldFolder
        }
      }).then(function(res) {
        citationStore.saveCitationNotice(res);
        citationStore.deleteItem(payload.content.data.pmid);
      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot add paper at this time',
          payload: payload
        });
      });
      break;

    default:
      break;

  }
});

module.exports = citationStore;
