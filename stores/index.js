// include this file only on the front end as it will set up the dispatcher, and
// only export a single instance of each store

const utils = require('../lib');
const dispatcher = utils.dispatcher;
const notifier = utils.notifier;

const ncbi = require('node-ncbi');
const popsicle = require('popsicle');

const citationStore = require('./CitationStore')();
const folderStore = require('./FolderStore')();
const userStore = require('./UserStore')();

dispatcher.register(function(payload) {
  switch (payload.type) {

    case 'NEW_SEARCH':
      var search = ncbi.createSearch(payload.content.queryString);
      search.getPage().then(function(papers) {
        citationStore.total = parseInt(search.count());
        citationStore.importItems(papers);
      }).catch(function(err) {
        notifier.create({
          class: 'danger',
          message: 'Cannot connect to NCBI',
          payload: payload
        });
        console.log(err);
      });
      break;

    case 'LOAD_MORE':
      if ( citationStore.items.length < citationStore.total ) {
        search.nextPage().then(function(papers) {
          citationStore.importItems(papers);
        });
      }
      break;

    case 'GET_DETAILS':
      ncbi.createCitation(payload.content.pmid).abstract().then(function(abstract) {
        citationStore.updateItem(payload.content.pmid, {abstract: abstract});
      });
      break;


    case 'GET_FOLDER_CONTENTS':
      popsicle({
        method: 'GET',
        url: '/folders/' + payload.content.folder + '/'
      }).then(function(res) {
        if (res.status === 200) {
          citationStore.importItems(res.body);
          citationStore.total = citationStore.items.length;
        }
      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot retrieve papers at this time',
          payload: payload
        });
      });
      break;

    case 'SAVE_CITATION':
      popsicle({
        method: 'POST',
        url: '/folders/' + payload.content.folder + '/',
        body: payload.content.data
      }).then(function(res) {

        switch (res.status) {
          case 200:
            notifier.create({
              class: 'success',
              message: 'Paper added to folder',
              autodismiss: true
            });
            break;

          case 400:
            notifier.create({
              class: 'warning',
              message: 'That paper is already in that folder'
            });
            break;

          case 404:
            notifier.create({
              class: 'danger',
              message: 'Cannot complete action'
            });
            break;
        }

      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot add paper at this time',
          payload: payload
        });
      })
      break;

    case 'MOVE_CITATION':
      popsicle({
        method: 'PUT',
        url: citationStore.apiUrlBase + payload.content.data.pmid + '/',
        body: {
          addFolder: payload.content.newFolder,
          removeFolder: payload.content.oldFolder
        }
      }).then(function(res) {
        citationStore.saveCitationNotice(res);
        citationStore.deleteItem(payload.content.data.pmid);
      }, function(err) {
        console.log(err);
        notifier.create({
          class: 'danger',
          message: 'Cannot add paper at this time',
          payload: payload
        });
      });
      break;

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

    case 'LOG_IN':
      popsicle({
        method: 'POST',
        body: {email: payload.content.email, password: payload.content.password},
        url: userStore.APIURLBASE + 'signin/'
      }).then((res) => {
        if (res.status === 200) {
          userStore.update(res.body.email);
        } else {
          userStore.loginError("Email address and password do not match");
        }
      });
      break;

    case 'LOG_OUT':
      popsicle({
        method: 'GET',
        url: userStore.APIURLBASE + '/logout/'
      }).then((res) => {
        userStore.update(res.body.email);
      });
      break;

    case 'CREATE_USER':
      popsicle({
        method: 'POST',
        body: {email: payload.content.email, password: payload.content.password},
        url: userStore.apiUrlBase + 'signup/'
      }).then((res) => {
        if (res.status === 200) {
          userStore.update(res.body.email);
        } else {
          //create an error
        }
      });
      break;

    default:
      break;

  }
});

module.exports = {
  citationStore: citationStore,
  folderStore: folderStore,
  userStore: userStore
}
