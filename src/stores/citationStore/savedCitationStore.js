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

      default:
        break;

    }
  }.bind(this));

}

CitationStore.prototype = Object.create(Parent.constructor.prototype);

module.exports = new CitationStore();
