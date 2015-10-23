module.exports = function(type) {
  var Store;
  if (type === 'SAVED') {
    Store = require('./SavedCitationStore');
  } else {
    Store = require('./SearchCitationStore');
  }
  return new Store();
}
