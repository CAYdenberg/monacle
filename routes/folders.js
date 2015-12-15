var express = require('express');
var router = express.Router();
var _ = require('underscore');

/**
 * ROUTES AFFECTING FOLDERS THEMSELVES
 */

//preliminary check to make sure there is a user logged in
router.all('/*', function(req, res, next) {
  if (!req.user) {
    res.status(401).json({});
  } else {
    next();
  }
})

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var collection = req.db.folders;
  //check if unique before or during insert
  collection.insertByName(name, req.user).then(function() {
    next();
  }).catch(function(err) {
    if (err.message === 'NotUniqueFolderSlug') {
      res.status(400);
      next();
    } else {
      next(err);
    }
  });
});

router.all('/', function(req, res, next) {
  var collection = req.db.folders;
  collection.find({user: req.user}).then(function(folders) {
    res.json(_.map(folders, function(folder) {
      return {
        name: folder.name,
        slug: folder.slug
      }
    }));
  });
});

//preliminary route to detect if a folder exists
router.all('/:folder', function(req, res, next) {
  var collection = req.db.folders;
  collection.findOne({
    user: req.user,
    slug: req.params.folder
  }).then(function(record) {
    if (record) {
      next();
    } else {
      res.status(404).json({});
    }
  });
});

//special route to delete a folder
router.delete('/:folder', function(req, res, next) {
  var collection = req.db.folders;
  collection.remove({
    slug: req.params.folder,
    user: req.user
  }).then(function() {
    next();
  });
});


/**
 * ROUTES AFFECTING THE CONTENTS OF FOLDERS (CITATIONS)
 */

router.post('/:folder', function(req, res, next) {
  var collection = req.db.citations;
  //check that a pmid is supplied
  if (!req.body.pmid) {
    res.status(400);
    res.next();
  }
  //check that the pmid, folder, and user together are unique;
  collection.find({
    pmid: req.body.pmid,
    folders: {$all: [req.params.folder]},
    user: req.user
  }).then(function(contents) {
    if (contents.length) {
      res.status(400);
      next();
    } else {
      collection.create(req.body, req.params.folder, req.user).then(function() {
        next();
      });
    }
  });
});

router.all('/:folder', function(req, res, next) {
  var collection = req.db.citations;
  collection.find({
    user: req.user,
    folders: {$all: [req.params.folder] }
  }).then(function(contents) {
    res.json(_.map(contents, function(item) {
      return item.data;
    }));
  });
})

module.exports = router;
