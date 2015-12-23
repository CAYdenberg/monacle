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
          url: o.apiUrlBase + '/' + payload.content.folder
        }).then(function(res) {
          if (res.status === 200) {
            o.importItems(res.body);
            o.total = res.body.count;
          }
        }, function(err) {
          notifier.create('lostBackend');
          console.log(err);
        }).then(function() {
          this.emit('CITATIONS_UPDATED');
        });
        break;

      default:
        break;

    }
  }.bind(this));

}

CitationStore.prototype = Object.create(Parent.prototype);

module.exports = new CitationStore();
