var slugify = require('slug');

/**
 * FOLDERS SCHEMA:
 ** Name: String
 ** Slug: String (slug)
 ** User: String (=User email address)
 */

module.exports = function(db) {
  var collection = db.get('folders');

  collection.insertByName = function(name, user) {
    var slug = slugify(name).toLowerCase();
    return new Promise(function(resolve, reject) {

      collection.find({slug: slug, user: user}, function(err, res) {
        if (err) {
          reject(err);
        } else if (res.length) {
          reject(Error('NotUniqueFolderSlug'));
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
  };

  return collection;
}
