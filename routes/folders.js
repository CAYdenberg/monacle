var express = require('express');
var router = express.Router();

router.post('/new', function(req, res, next) {
  var name = req.body.name;
  var collection = req.orm.folders();
  //check if unique before or during insert
  collection.insertByName(name, req.user).then(function(response) {
    next();
  }, function(error) {
    res.status(500).json({});
  });
});

router.all('/*', function(req, res, next) {
  var collection = req.orm.folders();
  if (!req.user) {
    res.json([]);
    return;
  }
  collection.find({user: req.user}, {sort: {name: 1}}, function(err, folders) {
    if (!err) {
      res.json(folders);
    } else {
      res.status(500).json({});
    }
  });
});

module.exports = router;
