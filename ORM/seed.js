var config = require('../config');

var ORM = require('./index');
var orm = new ORM(config.dbConnect);

console.log('Emptying databases and seeding with new data ...');

var folders = orm.folders();

folders.remove({});
folders.insertByName('Folder 1', 'ydenberg@gmail.com');
folders.insertByName('Folder Two', 'ydenberg@gmail.com');
folders.insertByName('Folder the IIIrd', 'ydenberg@gmail.com');


var users = orm.users();
users.remove({});
users.createIfUnique('ydenberg@gmail.com', 'test');
