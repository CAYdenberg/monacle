var flux = require('flux');
var _ = require('underscore');

var dispatcher = new flux.Dispatcher();

var formatAuthorList = function(authors) {
  var authArr,
    authStr = '';
  if (authors) {
    authArr = _.map(authors, function(author) {
      return author.name;
    });
    authStr = authArr.join(', ');
  }
  return authStr;
}

var formatYear = function(pubdate) {
  return pubdate.substring(0, 4);
}

var createTypingCallback = function(stateDefKey, reactClass) {
  return function(e) {
    var stateDef = {};
    stateDef[stateDefKey] = e.target.value;
    reactClass.setState(stateDef);
  };
}

var convertPubmedRecord = function(pubmedRecord) {
  //define an Item
  var item = {
    pubmedSummary: pubmedRecord,
    pmid : null,
    pmc : null,
    doi : null,
    abstract : null,
    fulltext : null,
    userData : null
  };
  //loop through the article ids, copying to the top-level.
  _.each(pubmedRecord.articleids, function(idObject) {
    if (idObject.idtype === 'pubmed') {
      //Change pubmed to pmid. Make sure it's an integer.
      item.pmid = parseInt(idObject.value, 10);
    } else if (idObject.idtype === 'pmc') {
      //Remove PMC from the beginning of the string and make sure it's an integer.
      item.pmc = parseInt(idObject.value.replace("PMC", ""));
    } else if (idObject.idtype === 'doi') {
      //Move DOI to the top level
      item.doi = idObject.value;
    }
  });
  return item;
}

module.exports = {
  dispatcher : dispatcher,
  formatAuthorList : formatAuthorList,
  formatYear : formatYear,
  createTypingCallback : createTypingCallback,
  convertPubmedRecord : convertPubmedRecord
};
