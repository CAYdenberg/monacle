var express = require('express');

var router = express.Router();

router.get('/lens/*', function(req, res) {
  res.render('lens');
});

router.get('/search', function(req, res) {
  req.context.appData = {
    query: req.query.query
  }
  res.render('app', req.context);
});

router.get('/', function(req, res) {
  req.context.pageName = 'home';
  req.context.background = Math.ceil(Math.random() * 3);
  res.render('home', req.context);
});

module.exports = router;
