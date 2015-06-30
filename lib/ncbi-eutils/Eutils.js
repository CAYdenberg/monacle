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

Eutils.prototype.send = function() {
  var url = this.generateUrl();
  var eutils = this;
  return popsicle({
    method : 'GET',
    url : url
  });
}

//wrapper around both the send method and the parser
Eutils.prototype.retrieve = function(parser) {
  return new Promise(function(resolve, reject) {
    this.send().then(function(data) {
      parser.parse().then(function(data) {
        resolve(data);
      }, function(err) {
        reject(err);
      });
    }, function(err) {
      reject(err);
    });
  });
}

module.exports = Eutils;
