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
  return Object.assign(Object.create(FolderStore), {
    folders: [],
    currentFolder: null
  });
}
