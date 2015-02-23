var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//models
var User = require('../models/user.js');

function getGeneralResponse() {
	return {
		nav : [
			{address: '/', label: 'Home'},
			{address: '/about/', label: 'About'},
			{address: '/contact/', label: 'Contact'}
		],
		stylesheets : ['/css/bootstrap.min.css', '/css/bootstrap.min.yeti.css', '/css/style.css'],
		scripts : ['/js/jquery.js', '/js/bootstrap.min.js']
	}
}

/* GET home page. */
router.get('/:page?', function(req, res, next) {
	var page = req.params.page;
	var fields = getGeneralResponse();
	console.log(req.session.passport.user);
	if ( typeof page === 'undefined' ) {
		res.render('home', fields );
	} else if ( page === 'about' ) {
		res.render('about', fields );
	} else if ( page === 'contact' ) {
		res.render('contact', fields );
	} else {
		next();
	}
});

/* GET search listing. */
router.get('/search', function(req, res) {
 	var fields = getGeneralResponse();
 	fields.scripts.push('/js/jquery-dateFormat.min.js');
 	fields.scripts.push('/js/bootstrap-paginator.js');
 	fields.scripts.push('/js/handlebars-v2.0.0.js');
 	fields.scripts.push('/js/livesearch.js');
 	res.render('search', fields );
});

router.get('/signup', function(req, res) {
	var context = getGeneralResponse();
	res.render('signup', context);
});

router.get('/signin', function(req, res) {
	var context = getGeneralResponse();
	res.render('signin', context);
});

module.exports = router;
