var Dispatcher = require('./Dispatcher.js');
var NCBI = require('../lib/ncbi-eutils/actions.js');

var CitationsData = function() {
  this.data = [];

  Dispatcher.register(function(payload) {
    switch (payload.type) {
      case 'search':
        NCBI.pubmedSearch(this.update, payload.content.queryString);
        break;
      default:
        return true;
    }
  }.bind(this));

  this.update = function(data) {
    console.log(data);
  }

}();
