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
    var users = req.db.users;
    users.validate(email, password).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err, false);
    });
	}
));


passport.use('signup', new LocalStrategy({
    passReqToCallback : true,
		usernameField : 'email',
		passwordField : 'password'
  },
  function(req, email, password, done) {
    var users = req.db.users;
    var folders = req.db.folders;
    var user;
    var findOrCreateUser = function() {
      users.createIfUnique(email, password).then(function(newUser) {
        //when user is succesfully created, create one starting folder for them
        user = newUser;
        return folders.insertByName('My Papers', user.email);
      }).then(function() {
        done(null, user);
      }).catch(function(err) {
        done(err, false);
      });
    }

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }
));


router.post('/signup', passport.authenticate('signup'), function(err, req, res, next) {
  if (err) {
    res.status(401);
  }
  next();
});

router.post('/signin', passport.authenticate('signin'), function(err, req, res, next) {
  if (err) {
    res.status(401);
  }
  next();
});

router.get('/logout', function(req, res, next) {
  req.logout();
  next();
});

router.get('/exists/:email', function(req, res, next) {
  var users = req.db.users;
  users.findOne({'email' : req.params.email}).then(function(found) {
    if (found) {
      return res.json({userExists : true});
    } else {
      return res.json({userExists : false});
    }
  });
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
