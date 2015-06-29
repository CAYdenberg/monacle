var _ = require('underscore');
var popsicle = require('popsicle');

function Eutils(args) {
  var defaults = {
    method : 'esearch',
    params : {}
  }
  this.settings = _.extend(defaults, args);
}

Eutils.prototype.getBase = function() {
  return this.base = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/' + this.settings.method + '.fcgi?';
}

Eutils.prototype.addParams = function(params) {
  _.extend(this.settings.params, params);
  return this.params;
}

Eutils.prototype.addIds = function(ids) {
  var idString = ids.join();
  return this.addParams({id : idString});
},

Eutils.prototype.generateUrl = function() {
  var url = this.getBase()
  for (var key in this.settings.params) {
    url = url + key + '=' + this.settings.params[key];
    url = url + '&';
  }
  //remove final &
  url = url.substring(0, url.length - 1);
  return encodeURI(url);
}

Eutils.prototype.send = function(callback, errHandler) {
  var url = this.generateUrl();
  var eutils = this;
  return popsicle({
    method : 'POST',
    url : url
  });
}

module.exports = Eutils;
