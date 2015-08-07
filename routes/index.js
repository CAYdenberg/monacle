var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//models
var User = require('../models/user.js');
var env = require('../config.js').env;


router.get('/lens/*', function(req, res) {
  res.render('lens');
});

/* GET other pages. */
router.all('/*', function(req, res, next) {
	req.context = {};
  if (env === 'development') {
		req.context.stylesheets = ['style.css'];
		req.context.scripts = ['vendor.js', 'script.js'];
	} else {
		req.context.stylesheets = ['style.min.css'];
		req.context.scripts = ['vendor.min.js', 'script.min.js'];
	}
	next();
});


router.get('/', function(req, res) {
  req.context.pagename = 'home';
  res.render('home', req.context);
});

router.get('/search', function(req, res) {
  req.context.pagename = 'search';
  res.render('search', req.context);
});

router.get('/signup', function(req, res) {
	res.render('signup', req.context);
});

router.get('/signin', function(req, res) {
	res.render('signin', req.context);
});


module.exports = router;
