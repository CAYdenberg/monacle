var Eutils = require('./Eutils.js');
var parseString = require('xml2js').parseString;

function Parser(xml) {

}

Parser.prototype.load = function(xml) {
  var parser = this;
  return new Promise(function(resolve, reject) {
    parseString(xml, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    });
  });
}

module.exports = Parser;
