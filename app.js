var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-hbs');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var MongoSessionStore = require('session-mongoose')(require('connect'));

var routes = require('./routes/index');
var users = require('./routes/users');
var lens = require('./routes/lens');
var config = require('./config.js');

var app = express();

// view engine setup
app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(config.dbConnect, {
    server : {
        socketOptions : { keepAlive : 1}
    }
});

var sessionStore = new MongoSessionStore({
    url : config.dbConnect
});

app.use(expressSession({
    secret : config.secretKey,
    resave : true,
    saveUninitialized : false,
    store : sessionStore
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.secretKey));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/lens', lens);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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
