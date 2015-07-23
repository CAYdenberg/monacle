var _ = require('underscore');
var popsicle = require('popsicle');

var Parser = require('./Parser.js');

function Api(args) {
  var defaults = {
    method : 'esearch',
    responseType : 'json',
    params : {}
  }
  this.settings = _.extend(defaults, args);
  this.addParams({ retmode : this.settings.responseType });
}

Api.prototype.getBase = function() {
  return this.base = 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/' + this.settings.method + '.fcgi?';
}

Api.prototype.addParams = function(params) {
  _.extend(this.settings.params, params);
  return this.params;
}

Api.prototype.addIds = function(ids) {
  var idString = ids.join();
  return this.addParams({id : idString});
},

Api.prototype.generateUrl = function() {
  var url = this.getBase();
  for (var key in this.settings.params) {
    url = url + key + '=' + this.settings.params[key];
    url = url + '&';
  }
  //remove final &
  url = url.substring(0, url.length - 1);
  return encodeURI(url);
}

Api.prototype.send = function() {
  var url = this.generateUrl();
  console.log(url);
  return popsicle({
    method : 'GET',
    url : url
  });
}

//wrapper around both the send method and the parser
Api.prototype.retrieve = function(parserName) {
  return this.send().then(function(response) {
    var body = response.body;
    var parser = new Parser(body, parserName);
    return parser.result;
  });
}

module.exports = Api;
