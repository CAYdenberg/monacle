var _ = require('underscore');
var utils = require('../utils');
var EE = require('event-emitter');
var popsicle = require('popsicle');

var dispatcher = utils.dispatcher;

function FolderStore() {
  EE.call(this);

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

FolderStore.prototype = Object.create(EE.prototype);

FolderStore.prototype.getFolders = function(args) {
  var o = this,
    defaults = {
      method : 'GET',
      url : o.apiUrlBase
    },
    settings = _.extend(defaults, args);
  popsicle(settings).then(function(res) {
    o.folders = res.body;
    this.emit('FOLDERS_UPDATED');
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
