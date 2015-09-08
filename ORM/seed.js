var config = require('../config');

var ORM = require('./index');
var orm = new ORM(config.dbConnect);

console.log('Emptying databases and seeding with new data ...');

var folders = orm.folders();

folders.remove({});
folders.insertByName('Folder 1');
folders.insertByName('Folder Two');
folders.insertByName('Folder the IIIrd');


var users = orm.users();
users.remove({});
users.createIfUnique('ydenberg@gmail.com', 'test');
