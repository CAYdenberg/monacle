
/**
 * CITATIONS SCHEMA:
 ** pmid: Integer,
 ** data: Object | imported directly from NCBI,
 ** folders: Array | folders that this item is in (each= Folder slug)
 ** user: String (= User email address)
 */


module.exports = function(db) {
  var collection = db.get('users');

  collection.save = function(data, folder, user, userData) {
    return collection.insert({
      pmid: data.pmid,
      data: data,
      folders: [folder],
      user: user
    });
  };

  return collection;
};
