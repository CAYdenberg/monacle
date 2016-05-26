var express = require('express');

var router = express.Router();

router.get('/lens/*', function(req, res) {
  res.render('lens');
});

router.get('/', function(req, res) {
  res.render('home', req.context);
});

module.exports = router;
