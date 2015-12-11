
module.exports = function(db) {
  var collection = db.get('users');

  collection.save = function(data, folder, user, userData) {
    return collection.insert({
      pmid: data.pmid,
      data: data,
      folder: folder,
      user: user
    });
  };

  return collection;
};
