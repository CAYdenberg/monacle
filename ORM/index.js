var _ = require('underscore');
var monk = require('monk');
var slugify = require('slug');

function ORM(connection) {
  this.db = monk(connection);
}

ORM.prototype.get = function(collection) {
  var collection = this.db.get(collection);
  return collection;
}

ORM.prototype.folders = function() {
  var collection = this.get('folders');
  var operations = {
    insertByName: function(name) {
      var slug = slugify(name);
      return new Promise( function(resolve, reject) {
        collection.find({slug : slug}, function(err, res) {
          if (err) {
            reject(err);
          } else if (res.length) {
            reject(Error('Folder with that name already exists'));
          } else {
            collection.insert({
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
    },
  }
  return _.extend(collection, operations);
}

module.exports = ORM;
