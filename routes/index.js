var express = require('express');
var _ = require('underscore');
const ncbi = require('node-ncbi');
const utils = require('../lib');

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Folders = require('../components/Folders');
// const Citations = require('../components/Citations');

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

  //add the user to the global state and populate back-end store
  req.context.state = {
    user: req.user
  };
  req.userStore.update(req.context.state.user);

  //find folders and attach to request
  req.db.folders.find({user: req.user}).then(function(folders) {

    //add folders to the global state and create store
    req.context.state.folders = _.map(folders, function(folder) {
      return {
        name: folder.name,
        slug: folder.slug
      }
    });
    req.folderStore.setAll(req.context.state.folders);

    //the Folders and Account HTML can now be rendered, even if we don't end up using them
    req.context.foldersHtml = ReactDOMServer.renderToString(<Folders store={req.folderStore} userStore={req.userStore} />);

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

  var citationStore = Object.create(require('../stores/citationStore'));

  // perform a search and populate store and application state
  var search = ncbi.createSearch(req.query.query);
  search.getPage().then((papers) => {
    req.context.state.citations = _.map(papers, (paper) => {
      return utils.convertPubmedRecord(paper)
    });
    citationStore.importItems(req.context.state.citations);
    req.context.state.totalCitations = citationStore.total = parseInt(search.count());

    //render the citations HTML
    req.context.citationsHtml = ReactDOMServer.renderToString(<Citations store={citationStore} folderStore={req.folderStore} />);

    res.render('app', req.context);
  });
});

router.get('/profile', function(req, res) {
  req.context.pagename = 'app profile';
  var folderCollection = req.db.folders;
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
