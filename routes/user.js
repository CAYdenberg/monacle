var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// passport/login.js
passport.use('signin', new LocalStrategy({
    passReqToCallback : true,
		usernameField : 'email',
		passwordField : 'password'
  }, function(req, email, password, done) {
    var users = req.orm.users();
		users.validate(email, password).then(function(user) {
      done(null, user);
    }, function(err) {
      done(err, false);
    })
	}
));


passport.use('signup', new LocalStrategy({
    passReqToCallback : true,
		usernameField : 'email',
		passwordField : 'password'
  },
  function(req, email, password, done) {
    var users = req.orm.users();
		var findOrCreateUser = function() {
      users.createIfUnique(email, password).then(function(user) {
        done(null, user)
      }, function(err) {
        done(err, false);
      });
    }

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }
));


router.post('/signup', passport.authenticate('signup'), function(req, res, next) {
  next();
});

router.post('/signin', passport.authenticate('signin'), function(req, res, next) {
	next();
});

router.all('/*', function(req, res) {
  var user = req.session.passport.user;
  if (user) {
    res.json({loggedIn: true, email: req.session.passport.user.email});
  } else {
    res.json({loggedIn: false, email: ''});
  }
});

module.exports = router;