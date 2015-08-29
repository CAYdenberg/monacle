/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils.js')

var FolderStore = require('./stores/FolderStore.js');
var folderStore = new FolderStore();
var Folders = require('./components/Folders.js')(folderStore);

var CitationStore = require('./stores/CitationStore.js');
var citationStore = new CitationStore();
var CitationList = require('./components/CitationList.js')(citationStore, folderStore);


$(document).ready(function() {
  if ( $('body').hasClass('app') ) {
    //on page load, get GET variable "query"
    // React.render(<Folders />, document.getElementById('folders'));
    React.render(<CitationList />, document.getElementById('citations'));
    utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
  }
});
