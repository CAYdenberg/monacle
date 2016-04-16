var express = require('express');
var _ = require('underscore');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Folders = require('../components/Folders');

var router = express.Router();

router.get('/lens/*', function(req, res) {
  res.render('lens');
});

/* GET other pages. */
router.all('/*', function(req, res, next) {
  req.folderStore = Object.create(require('../stores/folderStore'));
  req.userStore = Object.create(require('../stores/userStore'));

  req.context = {};
	req.context.stylesheets = ['style.css'];
	req.context.scripts = ['script.js'];

  req.context.state = {
    user: req.user
  };
  req.userStore.update(req.context.state.user);

  req.db.folders.find({user: req.user}).then(function(folders) {
    req.context.state.folders = _.map(folders, function(folder) {
      return {
        name: folder.name,
        slug: folder.slug
      }
    });
    req.folderStore.setAll(req.context.state.folders);
    next();
  });
});

router.get('/', function(req, res) {
  req.context.pagename = 'home';
  req.context.background = Math.ceil( Math.random() * 3 );
  res.render('home', req.context);
});

router.get('/about', function(req, res) {
  req.context.pagename = 'about';
  res.render('about', req.context);
});

router.get('/search', function(req, res) {
  req.context.pagename = 'app search';
  req.context.foldersHtml = ReactDOMServer.renderToString(<Folders store={req.folderStore} userStore={req.userStore} />);

  res.render('app', req.context);
});

router.get('/profile', function(req, res) {
  var folderCollection = req.db.folders;
  req.context.pagename = 'app profile';
  folderCollection.find({user: req.user}).then(function(folders) {
    req.context.folders = _.map(folders, function(folder) {
      return {
        name: folder.name,
        slug: folder.slug
      }
    });
    res.render('profile', req.context);
  });
});

router.get('/library/:folder', function(req, res) {
  req.context.pagename = 'app saved';
  req.context.globals.currentFolder = req.params.folder;
  res.render('app', req.context);
});

module.exports = router;
