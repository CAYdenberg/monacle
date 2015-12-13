var _ = require('underscore');
var monk = require('monk');
var slugify = require('slug');
var bCrypt = require('bcrypt-nodejs');

function ORM(connection) {
  this.db = monk(connection);
}

ORM.prototype.get = function(collection) {
  var collection = this.db.get(collection);
  return collection;
}

ORM.prototype.users = function() {
  var collection = this.get('users');

  //Generates hash using bCrypt
  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  }

  var operations = {

    validate: function(email, password) {
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
    },

    createIfUnique: function(email, password) {
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
    }

  };
  return _.extend(collection, operations);
}

ORM.prototype.folders = function() {
  var collection = this.get('folders');
  var operations = {

    insertByName: function(name, user) {
      var slug = slugify(name);
      return new Promise( function(resolve, reject) {
        collection.find({slug: slug, user: user}, function(err, res) {
          if (err) {
            reject(err);
          } else if (res.length) {
            reject(Error('Folder with that name already exists'));
          } else {
            collection.insert({
              user : user,
              slug : slug,
              name : name
            }, function(err, res) {
              if (err) {
                reject(err);
              } else {
                resolve(res);
              }
            })
          }
        });
      });
    }

  }
  return _.extend(collection, operations);
}

ORM.prototype.citations = function() {
  var collection = this.get('citations');
  var operations = {

    save: function(data, folder, user, userData) {
      return collection.insert({
        pmid: data.pmid,
        data: data,
        folder: folder,
        user: user
      });
    },

    move: function(pmid, newFolder, user) {
      return;
    },

    copy: function(pmid, newFolder, user) {
      return;
    },

    delete: function(pmid, newFolder, user) {

    }

  }
  return _.extend(collection, operations);
}

module.exports = ORM;
