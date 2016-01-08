var popsicle = require('popsicle');
var utils = require('../../utils');

var dispatcher = utils.dispatcher;
var notifier = utils.notifier;

var Parent = require('./citationStore.js');

function CitationStore() {

  Parent.constructor.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {

      case 'GET_FOLDER_CONTENTS':
        popsicle({
          method: 'GET',
          url: '/folders/' + payload.content.folder + '/'
        }).then(function(res) {
          if (res.status === 200) {
            o.total = res.body.length;
            o.importItems(res.body);
          }
        }, function(err) {
          notifier.create('lostBackend');
          console.log(err);
        });
        break;

      case 'SAVE_CITATION_TO_FOLDER':
        popsicle({
          method: 'GET',
          url: '/folders/' + payload.content.folderSlug + '/'
        }).then(function(res) {
          //alert that action was successful (getting proper name of folder)
          //alert may be different depending on whether this is a save or a move action

          //if a move action, remove from this Store and trigger UPDATE
        }, function(err) {
          //notifier.create whatever
          console.log(err);
        });
        break;

      default:
        break;

    }
  }.bind(this));

}

CitationStore.prototype = Object.create(Parent.constructor.prototype);

CitationStore.prototype.addCitationToFolder = function(payload) {
  var o = this;
  popsicle({
    method: 'POST',
    url: o.apiUrlBase + payload.content.folder,
    body: payload.content.data
  }).then(function(response) {

    if (response.status === 200) {
      notifier.create({
        class: 'success',
        message: 'Paper added to library',
        autodismiss: true
      });
    } else if (response.status === 400) {
      notifier.create({
        class: 'warning',
        message: 'That paper is already in that folder'
      });
    } else if (response.status === 404) {
      notifier.create({
        class: 'danger',
        message: 'Cannot add paper: Folder does not exist'
      });
    }

  }).catch(function(err) {
    notifier.create({
      class: 'danger',
      message: 'Cannot add paper at this time',
      payload: payload
    });
    console.log(err);
  });
}

module.exports = new CitationStore();
