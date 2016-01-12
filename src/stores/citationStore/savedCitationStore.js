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
          o.saveCitation(res);
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
          url: o.apiUrlBase + payload.content.data.pmid + '/',
          body: {
            addFolder: payload.content.newFolder,
            removeFolder: payload.content.oldFolder
          }
        }).then(function(res) {
          o.saveCitation(res);
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
  }.bind(this));

}

CitationStore.prototype = Object.create(Parent.constructor.prototype);

CitationStore.prototype.saveCitation = function(res) {
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

module.exports = new CitationStore();
