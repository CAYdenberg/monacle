/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils')

$(document).ready(function() {

  var user = $('#account-area').data('user');

  //create stores
  var folderStore = require('./stores/folderStore.js')();
  var userStore = require('./stores/userStore.js')( user );

  //get React classes and bind them to their stores
  var Folders = require('./components/Folders.js')(folderStore, userStore);
  var AlertArea = require('./components/AlertArea.js')();
  var AccountArea = require('./components/AccountArea.js')(userStore);
  var SigninForm = require('./components/SigninForm.js')(userStore);
  var SignupForm = require('./components/SignupForm.js')(userStore);

  //Render React classes
  React.render(<AccountArea />, document.getElementById('account-area'));
  React.render(<AlertArea />, document.getElementById('alert-area'));
  React.render(<SigninForm />, document.getElementById('signin-form-wrapper'));
  React.render(<SignupForm />, document.getElementById('signup-form-wrapper'));
  React.render(<Folders />, document.getElementById('folders'));

  utils.dispatcher.dispatch({ type : 'GET_FOLDERS' });

  if ( $('body').hasClass('search') ) {
    //stuff specific to the search page
    var citationStore = require('./stores/citationStore')();
    utils.dispatcher.dispatch({ type : 'NEW_SEARCH', content : { queryString : globals.query } });
    $('input[name=query]').val(globals.query);
  } else if ( $('body').hasClass('saved') ) {
    var citationStore = require('./stores/citationStore')('SAVED');
    utils.dispatcher.dispatch({ type : 'GET_FOLDER_CONTENTS', content: {folder: globals.currentFolder} });
  };

  var CitationList = require('./components/CitationList.js')(citationStore, folderStore);
  React.render(<CitationList />, document.getElementById('citations'));

  utils.emitter.on('USER_CHANGE', function() {
    utils.dispatcher.dispatch({ type: 'GET_FOLDERS' });
  });

  //Register non-React stuff.

  //Convenient event to close all the modals
  utils.emitter.on('CLOSE_MODALS', function() {
    $('.modal').modal('hide');
  });

  $('.modal').on('shown.bs.modal', function() {
    $('#main-nav').offcanvas('hide');
  });
  //var notification = utils.notifier.create('loginFailed');

});
