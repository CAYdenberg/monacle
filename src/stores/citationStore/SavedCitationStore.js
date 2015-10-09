var _ = require('underscore');

var dispatcher = require('../../utils').dispatcher;
var emitter = require('../../utils').emitter;

var Parent = require('./CitationStore.js');

function CitationStore() {

  Parent.call(this);
  var o = this;

  dispatcher.register(function(payload) {
    switch (payload.type) {
    }
  }.bind(this);

}

CitationStore.prototype = Object.create(Parent.prototype);
