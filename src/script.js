/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils.js')

var FolderStore = require('./stores/FolderStore.js');
var folderStore = new FolderStore();
var Folders = require('./components/Folders.js')(folderStore);

var CitationStore = require('./stores/CitationStore.js');
var citationStore = new CitationStore();
var CitationList = require('./components/CitationList.js')(citationStore, folderStore);

var AccountArea = require('./components/AccountArea.js')();

$(document).ready(function() {
  var currentUser = $('#account-area').data('user');
  React.render(<AccountArea currentUser={currentUser} />, document.getElementById('account-area'));

  if ( $('body').hasClass('app') ) {
    React.render(<Folders />, document.getElementById('folders'));
    React.render(<CitationList />, document.getElementById('citations'));
    //on page load, get GET variable "query"
    utils.dispatcher.dispatch({ type : 'GET_FOLDERS' });
    utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
  }
});
