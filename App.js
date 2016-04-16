require('dotenv').config();

require('node-jsx').install();

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

var passport = require('passport');
var expressSession = require('express-session');

var routes = require('./routes/index');
var user = require('./routes/user');
var folders = require('./routes/folders');
var citations = require('./routes/citations');

module.exports = function(config) {

  var app = express();
  config = config || require('./config');

  // Make our db accessible to our router
  var db = require('./db')(config.dbConnect);
  app.use(function(req, res, next){
    req.db = db;
    next();
  });

  // view engine setup
  app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views/partials'
  }));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, 'views'));

  hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'dist')));

  app.use(expressSession({
      secret : config.secretKey,
      resave : true,
      saveUninitialized : false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    if (req.session.passport.user) {
      req.user = req.session.passport.user.email;
    } else {
      req.user = null;
    }

    // TEMPORARY: MOCK OVER THE USER VARIABLE SO WE CAN TEST THIS FUCKING THING
    req.user = 'ydenberg@gmail.com';

    next();
  });


  app.use('/', routes);
  app.use('/user', user);
  app.use('/folders', folders);
  app.use('/citations', citations);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (config.env === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  return app;
}
