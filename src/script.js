/*esllint-env browser*/

const React = require('react');
const ReactDOM = require('react-dom');
const utils = require('../lib');

//create stores
const stores = require('../stores');

stores.folderStore.setAll(window.monocle.folders);
stores.userStore.update(window.monocle.user);

//TODO: this hydration is awkward and needs to be handled better,
//possibly within node-ncbi
stores.citationStore.importItems(window.monocle.citations);
stores.citationStore.total = window.monocle.totalCitations;
stores.citationStore.page = 1;

// get container components
const Citations = require('../components/Citations');
// const AccountArea = require('../components/AccountArea');
// const SigninForm = require('../components/SigninForm');
// const SignupForm = require('../components/SignupForm');
const Folders = require('../components/Folders');

const bodyClasses = document.body.classList;

if (bodyClasses.contains('app')) {
  //render the account-area, modals, and folders
  // ReactDOM.render(<AccountArea store={userStore} />, document.getElementById('account-area'));
  // ReactDOM.render(<SigninForm  store={userStore} />, document.getElementById('signin-form-wrapper'));
  // ReactDOM.render(<SignupForm  store={userStore} />, document.getElementById('signup-form-wrapper'));
  ReactDOM.render(<Folders store={stores.folderStore} userStore={stores.userStore} />, document.getElementById('folders-container'));


  if (bodyClasses.contains('search')) {
    ReactDOM.render(<Citations store={stores.citationStore} folderStore={stores.folderStore} />, document.getElementById('citations-wrapper'));
  }
}
//   utils.dispatcher.dispatch({
//     type: 'NEW_SEARCH',
//     content: {queryString: globals.query}
//   });
// }
// if (bodyClasses.contains('saved')) {
//   utils.dispatcher.dispatch({
//     type: 'GET_FOLDER_CONTENTS',
//     content: {folder: globals.currentFolder}
//   });
