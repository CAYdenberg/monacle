var _ = require('underscore');
var utils = require('../utils');
var EE = require('event-emitter');
var popsicle = require('popsicle');

var dispatcher = utils.dispatcher;

var emitter = EE({});

function FolderStore() {

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

FolderStore.prototype.onUpdate = function(callback) {
  emitter.on('UPDATE', callback);
}

FolderStore.prototype.getFolders = function(args) {
  var o = this,
    defaults = {
      method : 'GET',
      url : o.apiUrlBase
    },
    settings = _.extend(defaults, args);
  popsicle(settings).then(function(res) {
    o.folders = res.body;
    emitter.emit('UPDATE');
  });
}

FolderStore.prototype.addFolder = function(folderName) {
  var o = this;
  this.getFolders({
    method : 'POST',
    url: o.apiUrlBase + 'new/',
    body : {
      name : folderName
    }
  });
}

module.exports = new FolderStore();
