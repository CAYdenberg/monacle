var express = require('express');
var _ = require('underscore');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var router = express.Router();

var userStore = require('../stores/userStore');

var ReactBase = require('../components/Base');

router.get('/lens/*', function(req, res) {
  res.render('lens');
});

/* GET other pages. */
router.all('/*', function(req, res, next) {
  req.context = {};
	req.context.stylesheets = ['style.css'];
	req.context.scripts = ['script.js'];
  req.context.globals = {};
  var user = req.session.passport.user;

  //hack and pretend we have a valid user
  user = 'ydenberg@gmail.com';

  if (user) {
    req.context.globals.user = user.email;
    userStore.update(user.email);
  } else {
    req.context.globals.user = null;
  }
	next();
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
  req.context.reactHtml = ReactDOMServer.renderToString(<ReactBase />);
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
  })
});

router.get('/library/:folder', function(req, res) {
  req.context.pagename = 'app saved';
  req.context.globals.currentFolder = req.params.folder;
  res.render('app', req.context);
});

module.exports = router;
