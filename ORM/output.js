var config = require('../config');

var ORM = require('./index');
var orm = new ORM(config.dbConnect);

var folders = orm.folders();
folders.find({}, function(err, res) {
  console.log(res);
});

var users = orm.users();
users.find({}, function(err, res) {
  console.log(res);
});

var citations = orm.citations();
citations.find({}, function(err, res) {
  console.log(res);
})
