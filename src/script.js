/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils')

$(document).ready(function() {

  var user = $('#account-area').data('user');

  //create stores
  var citationStore = require('./stores/citationStore.js')();
  var folderStore = require('./stores/folderStore.js')();
  var userStore = require('./stores/userStore.js')( user );

  //get React classes and bind them to their stores
  var CitationList = require('./components/CitationList.js')(citationStore, folderStore);
  var Folders = require('./components/Folders.js')(folderStore);
  var AlertArea = require('./components/AlertArea.js')();
  var AccountArea = require('./components/AccountArea.js')(userStore);
  var SigninForm = require('./components/SigninForm.js')();

  //Render React classes for every page
  React.render(<AccountArea />, document.getElementById('account-area'));
  React.render(<SigninForm />, document.getElementById('signin-form-wrapper'));
  React.render(<AlertArea />, document.getElementById('alert-area'));

  if ( $('body').hasClass('app') ) {
    //Render React classes for the app/Search page specifically
    React.render(<Folders />, document.getElementById('folders'));
    React.render(<CitationList />, document.getElementById('citations'));

    //on page load, get GET variable "query"
    utils.dispatcher.dispatch({ type : 'GET_FOLDERS' });
    utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : utils.getParameterByName("query") } });
  }

  //Register bootstrap events.

  //Closes ALL modals.
  utils.emitter.on('CLOSE_MODALS', function() {
    $('.modal').modal('hide');
  });

  //var notification = utils.notifier.create('loginFailed');

});
