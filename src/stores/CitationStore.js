var utils = require('../utils.js');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var NCBI = require('../../lib/ncbi-eutils/actions.js');

function CitationStore() {

  this.data = [];

  dispatcher.register(function(payload) {
    switch (payload.type) {
      case 'NEW_SEARCH':
        NCBI.pubmedSearch(this.update, payload.content.queryString);
        break;
      default:
        return true;
    }
  }.bind(this));

}

CitationStore.prototype.update = function(data) {
  this.data = data;
  console.log(this.data);
  emitter.emit('CITATIONS_UPDATED');
}

module.exports = CitationStore;
