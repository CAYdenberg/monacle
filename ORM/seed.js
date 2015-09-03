var config = require('../config');

var ORM = require('./index');
var orm = new ORM(config.dbConnect);

var folders = orm.folders();

folders.remove({});
folders.insertByName('Folder 1');
folders.insertByName('Folder Two');
folders.insertByName('Folder the IIIrd');

process.exit();
