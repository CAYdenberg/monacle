var monk = require('monk');

module.exports = function(connectionString) {
  var db = monk(connectionString),
    users = require('./users')(db),
    folders = require('./folders')(db),
    citations = require('./citations')(db);

  return {
    users: users,
    folders: folders,
    citations: citations
  };

}
