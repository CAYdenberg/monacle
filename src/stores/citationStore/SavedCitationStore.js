var _ = require('underscore');
var popsicle = require('popsicle');

var dispatcher = require('../../utils').dispatcher;
var emitter = require('../../utils').emitter;

var Parent = require('./CitationStore.js');

function CitationStore() {

  Parent.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {
      case: 'GET_FOLDER_CONTENTS':
        popsicle({
          method: 'GET',
          url: o.apiUrlBase + '/' + payload.content.folder
        }).then(function(res) {
          if (res.status === 200) {
            this.importItems(res.body);
          } else {

          }
        });
    }
  }.bind(this);

}

CitationStore.prototype = Object.create(Parent.prototype);
