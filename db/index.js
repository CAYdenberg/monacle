var monk = require('monk');

module.exports = function(connectionString) {
  var db = monk(connectionString);
  return {
    users: require('./users')(db),
    folders: require('./folders')(db),
    citations: require('./citations')(db)
  };
}
