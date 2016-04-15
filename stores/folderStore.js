const popsicle = require('popsicle');

const emitter = require('event-emitter')({});

const lib = require('../lib');
const dispatcher = lib.dispatcher;
const notifier = lib.notifier;

var folderStore = {
  folders: [],

  currentFolder: null,

  apiUrlBase: "/folders",

  onUpdate: function(callback) {
    emitter.on('UPDATE', callback);
  },

  setCurrentFolder:  function(folderName) {
    this.currentFolder = folderName;
  },

  setAll: function(folders) {
    this.folders = folders;
    emitter.emit('UPDATE');
  }

}

dispatcher.register(function(payload) {
  switch (payload.type) {

    case 'GET_FOLDERS':
      popsicle({
        method : 'GET',
        url : folderStore.apiUrlBase
      }).then((res) => {
        folderStore.setAll(res.body);
      });
      break;

    case 'ADD_FOLDER':
      popsicle({
        method : 'POST',
        url: folderStore.apiUrlBase,
        body: {
          name: payload.content.name
        }
      }).then((res) => {
        if (res.status === 200) {
          folderStore.setAll(res.body);
        } else if (res.status === 400) {
          notifier.create({
            class: 'warning',
            message: 'A folder with that name already exists'
          })
        }
      }).catch(function(err) {
        notifier.create({
          class: 'danger',
          message: 'Cannot add folder at this time'
        });
        console.log(err);
      });
      break;

    default:
      break;
  }
});

module.exports = folderStore;
