var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');

var routes = require('./routes/index');
var api = require('./routes/api');

module.exports = function() {

  var app = express();

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

  //specify assets
  app.use(function(req, res, next) {
    req.context = {
      stylesheets: [
        'https://fonts.googleapis.com/css?family=News+Cycle:400,700',
        '/fonts/icomoon/style.css',
        '/css/style.css'
      ],
      scripts: [
        '/js/script.js'
      ]
    };
    next();
  });

  //specify routes
  app.use('/', routes);
  app.use('/api', api);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (process.env.ENV === 'development') {
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

  app.set('port', process.env.PORT || 3000);

  return app;
}
