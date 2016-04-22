const emitter = require('event-emitter')({});

const FolderStore = {

  APIURLBASE: "/folders",

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

module.exports = () => {
  const folderStore = Object.create(FolderStore);
  folderStore.folders = [];
  folderStore.currentFolder = null;
  return folderStore;
}
