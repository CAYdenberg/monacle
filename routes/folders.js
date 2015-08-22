var express = require('express');
var router = express.Router();

var slugify = require('slug');

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var slug = slugify(name);
  var table = req.db.get('folders');
  table.insert({
    name : name,
    slug : slug
  }, function(err, result) {
    if ( !err ) {
      next();
    } else {
      //respond with an error
    }
  });
});

router.all('/', function(req, res, next) {
  var table = req.db.get('folders');
  table.find({}, {sort: {name: 1}}, function(err, folders) {
    if (!err) {
      res.json(folders)
    } else {
      //respond with an error
    }
  });
});


module.exports = router;
