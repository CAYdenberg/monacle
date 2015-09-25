var express = require('express');
var router = express.Router();

router.post('/:folder/:pmid', function(req, res, next) {
  var folder = req.params.folder;
  var citationData = req.body.data;
  var user = req.user;
  var collection = req.orm.citations();
  collection.save(citationData, folder, user).then(function(record) {
    next();
  }, function(err) {
    console.log('Error occurred while trying to save the paper');
  });
});

router.all('/:folder/:pmid', function(req, res, next) {
  var pmid = req.params.pmid;
  var folder = req.params.folder;
  var collection = req.orm.citations();
  var user = req.user;
  collection.findOne({
    pubmed: pmid,
    folder: folder,
    user: user
  }).then(function(record) {
    res.json(record);
  }, function(err) {
    console.log('Citation not found');
    res.status(404).json({});
  });
});

router.get('/:folder', function(req, res, next) {

});

module.exports = router;
