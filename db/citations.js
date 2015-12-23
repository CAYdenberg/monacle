
/**
 * CITATIONS SCHEMA:
 ** pmid: Integer,
 ** data: Object | imported directly from NCBI,
 ** folders: Array | folders that this item is in (each= Folder slug)
 ** user: String (= User email address)
 */


module.exports = function(db) {
  var collection = db.get('citations');

  collection.create = function(data, folder, user, userData) {
    return new Promise(function(resolve, reject) {

      collection.insert({
        pmid: data.pmid,
        data: data,
        folders: [folder],
        user: user,
        userData: (userData || {})
      }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });

    });
  };

  collection.modify = function(pmid, user, modification) {
    return new Promise(function(resolve, reject) {

      collection.update(
        {
          pmid: pmid,
          user: user
        },
        modification,
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );

    });
  };

  collection.addToFolder = function(pmid, user, folder) {
    return collection.modify(pmid, user, {$addToSet: {folders: folder} });
  };

  collection.removeFromFolder = function(pmid, user, folder) {
    return collection.modify(pmid, user, {$pull: {folders: folder} });
  };

  return collection;
};
