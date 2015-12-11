var express = require('express');
var router = express.Router();

/**
 * CITATIONS API.

 * GET /citations/:folder
 * Return all of the citations (as an array) in this folder for the current user

 * GET /citations/:folder/:pmid
 * Return the requested citation, identified by it's pmid

 * POST /citations/:folder/:pmid
 * Add a citation to a particular folder. The complete record (see below) for
 * the citation must be provided in the request body.
 * Return the new citation, or 500 on failure

 * TODO:
 * PUT /citations/:folder/:pmid
 * Add a citation to a particular folder. The complete modified record (see below) for
 * the citation must be provided in the request body.
 * If {moveTo : folder} is added to the record, delete it from the old folder
 * and move it to the one specified by moveTo.
 * Return the new citation, or 500 on failure

 * TODO:
 * DELETE /citations/:folder/:pmid
 * Remove a citation from a folder
 * Return the new citation, or 500 on failure

 * Returned data structure (JSON fdbat):
{
  pmid : unique ID,
  pubmed: {Object - data returned from pubmed},
  pmc : unique ID,
  doi : unique ID,
  abstract : String,
  fulltext : String,
  userData : {Object - data set for this record by the user}
}

  * However, citation objects are stored in the database as follows:
{
  data : the object above
  pmid : copy of data.pmid - stored at top level as a unique identifier
  user : current user's email address, used as a unique identifier
  folders : the folders in which this citation is stored
}
 */

router.get('/:folder', function(req, res, next) {
  var folder = req.params.folder;
  var collection = req.db.citations();
  var user = req.user;
  collection.find({
    folder: folder,
    user: user
  }).then(function(citations) {
    res.json(citations.map(function(citation) {
      return citation.data;
    }));
  }, function(err) {
    res.status(500).json({});
  });
});

router.post('/:folder/:pmid', function(req, res, next) {
  var folder = req.params.folder;
  var citationData = req.body.data;
  var user = req.user;
  var collection = req.db.citations();
  collection.save(citationData, folder, user).then(function(record) {
    next();
  }, function(err) {
    res.status(500).json({});
  });
});

router.all('/:folder/:pmid', function(req, res, next) {
  var pmid = req.params.pmid;
  var folder = req.params.folder;
  var collection = req.db.citations();
  var user = req.user;
  collection.findOne({
    pmid: pmid,
    folder: folder,
    user: user
  }).then(function(record) {
    res.json(record.data);
  }, function(err) {
    res.status(404).json({});
  });
});

module.exports = router;
