const popsicle = require('popsicle');

const emitter = require('event-emitter')({});

const lib = require(process.env.ROOT+'/lib');
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

  getFolders: function() {
    popsicle({
      method : 'GET',
      url : folderStore.apiUrlBase
    }).then((res) => {
      this.folders = res.body;
      emitter.emit('UPDATE');
    });
  },

  addFolder: function(payload) {
    popsicle({
      method : 'POST',
      url: folderStore.apiUrlBase,
      body: {
        name: payload.content.name
      }
    }).then((response) => {

      if (response.status === 200) {
        this.folders = response.body;
        emitter.emit('UPDATE');
      } else if (response.status === 400) {
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
  }

}

dispatcher.register(function(payload) {
  switch (payload.type) {

    case 'GET_FOLDERS':
      folderStore.getFolders();
      break;

    case 'ADD_FOLDER':
      folderStore.addFolder(payload);
      break;

    default:
      break;
  }
});

module.exports = folderStore;
