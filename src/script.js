/** @jsx React.DOM */

var React = require('react');
var utils = require('./utils');

//create stores
var folderStore = require('./stores/folderStore.js'),
  userStore = require('./stores/userStore.js'),
  searchCitationStore = require('./stores/citationStore/searchCitationStore'),
  savedCitationStore = require('./stores/citationStore/savedCitationStore');

//get components
var CitationList = require('./components/CitationList');
var AccountArea = require('./components/AccountArea');
var SigninForm = require('./components/SigninForm');
var SignupForm = require('./components/SignupForm');
var Folders = require('./components/Folders');
var NotificationArea = require('./components/NotificationArea');

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Monocle = {
    // All pages
    'common': {
      init: function() {
        userStore.onUpdate(function() {

          //close the sign-in and sign-up forms when the user changes
          $('.modal').modal('hide');

          //if a user is logged in, grab their folders
          if (userStore.loggedIn) {
            utils.dispatcher.dispatch({
              type: 'GET_FOLDERS'
            });
          }

        });

        //set the initial user store with the user email passed from the backend
        userStore.update(globals.user);

        //render the account-area, modals, and folders
        React.render(<AccountArea store={userStore} />, document.getElementById('account-area'));
        React.render(<SigninForm  store={userStore} />, document.getElementById('signin-form-wrapper'));
        React.render(<SignupForm  store={userStore} />, document.getElementById('signup-form-wrapper'));
        React.render(<Folders store={folderStore} userStore={userStore} />, document.getElementById('folders'));
        React.render(<NotificationArea />, document.getElementById('alert-area'));

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },

    'search': {
      init: function() {
        React.render(<CitationList citationStore={searchCitationStore} folderStore={folderStore} />, document.getElementById('citations'));
        //Send search query off to the dispatcher
        utils.dispatcher.dispatch({
          type: 'NEW_SEARCH',
          content: {queryString: globals.query}
        });
        //set the search box contents to the query string
        $('input[name=query]').val(globals.query);
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },

    'saved': {
      init: function() {
        React.render(<CitationList citationStore={savedCitationStore} folderStore={folderStore} />, document.getElementById('citations'));
        //grab folder contents
        utils.dispatcher.dispatch({
          type: 'GET_FOLDER_CONTENTS',
          content: {folder: globals.currentFolder}
        });
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Monocle;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);
})(jQuery); // Fully reference jQuery after this point.
