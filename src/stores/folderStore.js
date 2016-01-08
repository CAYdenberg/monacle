var EE = require('event-emitter');
var popsicle = require('popsicle');
var utils = require('../utils');

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

var emitter = EE({});

function FolderStore() {

  this.folders = [];
  this.currentFolder = null;

  this.apiUrlBase = "/folders/";

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'GET_FOLDERS':
        this.getFolders();
        break;

      case 'ADD_FOLDER':
        this.addFolder(payload);
        break;

      default:
        break;
    }
  }.bind(this));
}

FolderStore.prototype.onUpdate = function(callback) {
  emitter.on('UPDATE', callback);
}

FolderStore.prototype.setCurrentFolder = function(folderName) {
  this.currentFolder = folderName;
}

FolderStore.prototype.getFolders = function() {
  var o = this;
  popsicle({
    method : 'GET',
    url : o.apiUrlBase
  }).then(function(res) {
    o.folders = res.body;
    emitter.emit('UPDATE');
  });
}

FolderStore.prototype.addFolder = function(payload) {
  var o = this;
  popsicle({
    method : 'POST',
    url: o.apiUrlBase,
    body : {
      name : payload.content.name
    }
  }).then(function(response) {

    if (response.status === 200) {
      o.folders = response.body;
      emitter.emit('UPDATE');
    } else if (response.status === 400) {
      notifier.create({
        class: 'warning',
        message: 'A folder with that name already exists'
      })
    }

  }).catch(function(err) {
    notifier.create({
      class: 'danger',
      message: 'Cannot add folder at this time'
    });
    console.log(err);
  });
}

module.exports = new FolderStore();
