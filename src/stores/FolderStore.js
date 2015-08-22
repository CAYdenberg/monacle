var _ = require('underscore');
var utils = require('../utils.js');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var popsicle = require('popsicle');

function FolderStore() {
  var o = this;

  this.folders = [];
  this.appUrlBase = "/folders/";

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'ADD_FOLDER':
        popsicle({
          method: 'POST',
          url: o.appUrlBase,
          body: {
            name : payload.content.name
          }
        }).then( function(res) {
          o.folders = res;
          emitter.emit('FOLDERS_UPDATED');
        });
        break;

      default:
        break;
    }
  });
}

module.exports = FolderStore;
