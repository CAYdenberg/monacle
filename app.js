var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

var passport = require('passport');
var expressSession = require('express-session');
var config = require('./config.js');

var routes = require('./routes/index');
var user = require('./routes/user');
var folders = require('./routes/folders');
var citations = require('./routes/citations');

var app = express();

// Make our db accessible to our router
var ORM = require('./ORM');
var orm = new ORM(config.dbConnect);
app.use(function(req, res, next){
  req.orm = orm;
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

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
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
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
