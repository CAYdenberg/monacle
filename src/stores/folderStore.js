var _ = require('underscore');
var utils = require('../utils');
var dispatcher = utils.dispatcher;
var emitter = utils.emitter;

var popsicle = require('popsicle');

function FolderStore() {
  var o = this;

  this.folders = [];
  this.apiUrlBase = "/folders/";

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'GET_FOLDERS':
        this.getFolders();
        break;

      case 'ADD_FOLDER':
        this.addFolder(payload.content.name);
        break;

      default:
        break;
    }
  }.bind(this));
}

FolderStore.prototype.getFolders = function(args) {
  var o = this,
    defaults = {
      method : 'GET',
      url : o.apiUrlBase,
    },
    settings = _.extend(defaults, args);
  popsicle(settings).then(function(res) {
    o.folders = res.body;
    emitter.emit('FOLDERS_UPDATED');
  });
}

FolderStore.prototype.addFolder = function(folderName) {
  this.getFolders({
    method : 'POST',
    body : {
      name : folderName
    }
  });
}

module.exports = function() {
  return new FolderStore();
}
