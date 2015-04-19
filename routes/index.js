var express = require('express');
var router = express.Router();

var env = require('../config.js').env;


router.get('/lens', function(req, res) {
  res.render('lens');
});


router.all('/*', function(req, res, next) {
	req.context = {
		nav : [
			{address: '/', label: 'Home'},
			{address: '/about/', label: 'About'},
			{address: '/contact/', label: 'Contact'}
		],
	};
	if (env === 'development') {
		req.context.stylesheets = ['vendor.css', 'style.css'];
		req.context.scripts = ['vendor.js', 'script.js'];
	} else {
		req.context.stylesheets = ['vendor.min.css', 'style.min.css'];
		req.context.scripts = ['vendor.min.js', 'script.min.js'];
	}
	next();
});


/* GET other pages. */
router.get('/:page?', function(req, res, next) {
	var page = req.params.page;
	var fields = req.context;
	if ( typeof page === 'undefined' ) {
		res.render('home', fields );
	} else if ( page === 'about' ) {
		res.render('about', fields );
	} else if ( page === 'contact' ) {
		res.render('contact', fields );
	} else if ( page === 'search' ) {
		res.render( 'search', fields )
	} else {
		next();
	}
});

module.exports = router;
