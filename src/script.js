/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils.js')

var FolderStore = require('./stores/FolderStore.js');
var CitationStore = require('./stores/CitationStore.js');
var UserStore = require('./stores/UserStore.js');

$(document).ready(function() {

  var folderStore = new FolderStore();
  var Folders = require('./components/Folders.js')(folderStore);

  var citationStore = new CitationStore();
  var CitationList = require('./components/CitationList.js')(citationStore, folderStore);

  var userStore = new UserStore( $('account-area').data('user') );
  var AccountArea = require('./components/AccountArea.js')(userStore);
  var SigninForm = require('./components/SigninForm.js')();

  React.render(<AccountArea />, document.getElementById('account-area'));
  React.render(<SigninForm />, document.getElementById('signin-form-wrapper'));

  if ( $('body').hasClass('app') ) {
    React.render(<Folders />, document.getElementById('folders'));
    React.render(<CitationList />, document.getElementById('citations'));
    //on page load, get GET variable "query"
    utils.dispatcher.dispatch({ type : 'GET_FOLDERS' });
    utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
  }

});
