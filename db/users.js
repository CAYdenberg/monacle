var _ = require('underscore');
var bCrypt = require('bcrypt-nodejs');

//Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

/**
 * THE USER SCHEMA:
 ** email: String,
 ** password: String (encrypted)
 */

module.exports = function(db) {
  var collection = db.get('users');

  collection.validate = function(email, password) {
    return new Promise(function(resolve, reject) {
      collection.findOne({ 'email' :  email }, function(err, user) {
        if (err) {
          reject(err);
        } else if (!user) {
          reject(new Error('User does not exist'));
        } else if (!isValidPassword(user, password)) {
          reject(new Error('Password is invalid'));
        } else {
          resolve(user);
        }
      });
    });
  };

  collection.createIfUnique = function(email, password) {
    return new Promise(function(resolve, reject) {
      collection.findOne({'email':email}, function(err, user) {
        // In case of any error return
        if (err) {
          reject(err);
        }
        // already exists
        if (user) {
          reject(new Error('User already exists'));
        } else {
          // if there is no user with that email
          // create the user
          collection.insert({
            email : email,
            password : createHash(password)
          }, function(err, newUser) {
            if (err) {
              reject(err);
            } else {
              resolve(newUser);
            }
          })
        }
      })
    })
  };

  return collection;
}
