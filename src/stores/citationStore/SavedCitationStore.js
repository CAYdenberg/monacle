var _ = require('underscore');
var popsicle = require('popsicle');

var dispatcher = require('../../utils').dispatcher;
var emitter = require('../../utils').emitter;
var notifier = require('../../utils').notifier;

var Parent = require('./CitationStore.js');

function CitationStore() {

  Parent.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {
      case 'GET_FOLDER_CONTENTS':
        popsicle({
          method: 'GET',
          url: o.apiUrlBase + '/' + payload.content.folder
        }).then(function(res) {
          if (res.status === 200) {
            o.importItems(res.body);
            o.total = res.body.count;
          }
        }, function(err) {
          notifier.create('lostBackend');
        }).then(function() {
          emitter.emit('CITATIONS_UPDATED');
          console.log(o);
        });
        break;

      default:
        break;

    }
  }.bind(this));

}

CitationStore.prototype = Object.create(Parent.prototype);

module.exports = CitationStore;
