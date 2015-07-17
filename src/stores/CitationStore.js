var utils = require('../utils.js');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var NCBI = require('../../lib/NCBI/NCBI.js');

function CitationStore() {

  this.data = [];

  dispatcher.register(function(payload) {
    switch (payload.type) {
      case 'NEW_SEARCH':
        var search = NCBI.pubmedSearch(payload.content.queryString);
        search.then(function(data) {
          this.update(data);
        }.bind(this));
        break;
      default:
        return true;
    }
  }.bind(this));

}

CitationStore.prototype.update = function(data) {
  this.data = data;
  emitter.emit('CITATIONS_UPDATED');
}

module.exports = CitationStore;
