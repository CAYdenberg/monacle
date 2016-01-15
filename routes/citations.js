var express = require('express');
var router = express.Router();

router.all('/*', function(req, res, next) {
  if (!req.user) {
    res.status(401).json({});
  } else {
    next();
  }
});

//preliminary route to make sure a record exists before we work on it
router.all('/:pmid', function(req, res, next) {
  var collection = req.db.citations;
  var pmid = parseInt(req.params.pmid, 10);
  collection.findOne({
    user: req.user,
    pmid: pmid
  }).then(function(result) {
    if (!result) {
      console.log('No pmid');
      res.status(404).json({});
    } else {
      next();
    }
  });
});

router.delete('/:pmid', function(req, res) {
  var collection = req.db.citations;
  var pmid = parseInt(req.params.pmid, 10);
  collection.remove({
    user: req.user,
    pmid: pmid
  }).then(function() {
    res.json({});
  });
});

router.put('/:pmid', function(req, res, next) {
  var collection = req.db.citations;
  var pmid = parseInt(req.params.pmid, 10);
  var operations = [];
  if (req.body.addFolder) {
    operations.push(collection.addToFolder(pmid, req.user, req.body.addFolder));
  }
  if (req.body.removeFolder) {
    operations.push(collection.removeFromFolder(pmid, req.user, req.body.removeFolder));
  }
  Promise.all(operations).then(function() {
    next();
  });
});

router.all('/:pmid', function(req, res) {
  var collection = req.db.citations;
  var pmid = parseInt(req.params.pmid, 10);
  collection.findOne({
    user: req.user,
    pmid: pmid
  }).then(function(result) {
    res.json({
      data: result.data,
      userData: result.userData,
      folders: result.folders
    });
  });
});

module.exports = router;
