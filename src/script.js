/*esllint-env browser*/

const React = require('react');
const ReactDOM = require('react-dom');
const utils = require('../lib');

//create stores
const stores = require('../stores');

stores.folderStore.setAll(window.monocle.folders);
stores.userStore.update(window.monocle.user);


// get container components
// const CitationList = require('../components/CitationList');
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

  // ReactDOM.render(<CitationList citationStore={citationStore} folderStore={folderStore} />, document.getElementById('citations'));
}
// if (bodyClasses.contains('search')) {
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
