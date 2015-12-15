
/**
 * CITATIONS SCHEMA:
 ** pmid: Integer,
 ** data: Object | imported directly from NCBI,
 ** folders: Array | folders that this item is in (each= Folder slug)
 ** user: String (= User email address)
 */


module.exports = function(db) {
  var collection = db.get('users');

  collection.create = function(data, folder, user, userData) {
    return new Promise(function(resolve, reject) {

      collection.insert({
        pmid: data.pmid,
        data: data,
        folders: [folder],
        user: user
      }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

    });
  };

  collection.addToFolder = function(pmid, user, folder) {
    return new Promise(function(resolve, reject) {

      collection.update(
        {
          pmid: pmid,
          user: user
        },
        {folders: {$addToSet: folder}},
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );

    });
  }

  return collection;
};
