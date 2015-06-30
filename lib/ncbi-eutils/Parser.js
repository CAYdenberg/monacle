var Eutils = require('./Eutils.js');
var parseString = require('xml2js').parseString;
var _ = require('underscore');


//built-in protocols
function count(docObj) {
  return docObj.eSearchResult.Count;
}

function ids(docObj) {
  return docObj.eSearchResult.IdList[0].Id;
}

function entireDoc(docObj) {
  return docObj;
}

//callback may be a string identifying a built-in protocol, or it may
//be an actual function
function Parser(callback) {
  var protocols = {
    count : count,
    ids : ids,
    entireDoc : entireDoc
  }
  //set the callback
  if (_.isString(callback)) {
    if (protocols[callback]) {
      this.callback = protocols[callback];
    } else {
      this.callback = false;
    }
  } else if (_.isFunction(callback)) {
    this.callback = callback;
  } else {
    this.callback = false;
  }
}

Parser.prototype.parse = function(xml) {
  var parser = this;
  return new Promise(function(resolve, reject) {
    var data;
    parseString(xml, function(err, result) {
      if (err) {
        reject(err)
      } else {
        if (parser.callback) {
          data = parser.callback(result);
          resolve(data);
        } else {
          reject( {msg : 'No parser protocol set' });
        }
      }
    });
  });
}


module.exports = Parser;
