var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.all('/*', function(req, res, next) {
  if (!req.user) {
    res.status(401).json({});
  } else {
    next();
  }
})

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var collection = req.orm.folders();
  //check if unique before or during insert
  collection.insertByName(name, req.user).then(function() {
    next();
  }).catch(function(err) {
    console.log(err.message);
    if (err.message === 'NotUniqueFolderSlug') {
      res.status(400);
      next();
    } else {
      next(err);
    }
  });
});

router.all('/', function(req, res, next) {
  var collection = req.orm.folders();
  collection.findAllForUser(req.user).then(function(folders) {
    res.json(_.map(folders, function(folder) {
      return {
        name: folder.name,
        slug: folder.slug
      }
    }));
  }).catch(function(err) {
    console.log(err);
    next(err);
  });
});

router.all('/:folder', function(req, res, next) {
  var collection = req.orm.citations();
  var user = req.user;
  collection.getFolderContents(req.params.folder, folder).then(function (contents) {
    if (!folder) {
      res.status(404).json({});
    } else {
      res.json(_.map(contents, function(item) {
        return item.data;
      }));
    }
  });
})

module.exports = router;
