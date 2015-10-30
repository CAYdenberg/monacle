var express = require('express');
var router = express.Router();

router.get('/:folder', function(req, res, next) {
  var folder = req.params.folder;
  var collection = req.orm.citations();
  var user = req.user;
  collection.find({
    folder: folder,
    user: user
  }).then(function(data) {
    res.json(data);
  }, function(err) {
    res.status(500).json({});
  });
});

router.post('/:folder/:pmid', function(req, res, next) {
  var folder = req.params.folder;
  var citationData = req.body.data;
  var user = req.user;
  var collection = req.orm.citations();
  collection.save(citationData, folder, user).then(function(record) {
    next();
  }, function(err) {
    res.status(500).json({});
  });
});

router.all('/:folder/:pmid', function(req, res, next) {
  var pmid = req.params.pmid;
  var folder = req.params.folder;
  var collection = req.orm.citations();
  var user = req.user;
  collection.findOne({
    pmid: pmid,
    folder: folder,
    user: user
  }).then(function(record) {
    res.json(record);
  }, function(err) {
    res.status(404).json({});
  });
});

module.exports = router;
